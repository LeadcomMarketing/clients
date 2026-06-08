import "server-only"

/**
 * GitHub API sync — commits updated tenant files directly to the repo.
 * This triggers an automatic Vercel redeploy so the static import registry
 * is rebuilt and the new tenant data goes live without any manual steps.
 *
 * Required env vars:
 *   GITHUB_TOKEN  — Personal Access Token with "Contents: Read & Write" on the repo
 *   GITHUB_REPO   — e.g. "LeadcomMarketing/clients"
 *   GITHUB_BRANCH — branch to commit to (default: "main")
 */

interface FileEntry {
  path: string   // relative to repo root, e.g. "tenants/haga-tandlakeri.json"
  content: string
}

async function getFileSha(
  repo: string,
  filePath: string,
  branch: string,
  headers: Record<string, string>
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
      { headers }
    )
    if (!res.ok) return undefined
    const data = await res.json() as { sha?: string }
    return data.sha
  } catch {
    return undefined
  }
}

/**
 * Commit multiple files to GitHub in a single atomic commit using the Git
 * Trees API.  Falls back silently if env vars aren't set (local dev).
 */
export async function commitFilesToGithub(
  files: FileEntry[],
  commitMessage: string
): Promise<void> {
  const token  = process.env.GITHUB_TOKEN
  const repo   = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? "main"

  if (!token || !repo) return  // silently skip in local dev / if not configured

  const base    = "https://api.github.com"
  const headers = {
    Authorization:        `Bearer ${token}`,
    "Content-Type":       "application/json",
    Accept:               "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  // 1. Get current branch tip commit
  const refRes = await fetch(`${base}/repos/${repo}/git/ref/heads/${branch}`, { headers })
  if (!refRes.ok) {
    console.error("[github-sync] Could not get branch ref:", await refRes.text())
    return
  }
  const { object: { sha: baseSha } } = await refRes.json() as { object: { sha: string } }

  // 2. Get current tree SHA
  const commitRes = await fetch(`${base}/repos/${repo}/git/commits/${baseSha}`, { headers })
  if (!commitRes.ok) { console.error("[github-sync] Could not get commit"); return }
  const { tree: { sha: treeSha } } = await commitRes.json() as { tree: { sha: string } }

  // 3. Create blobs for each file
  const treeItems = await Promise.all(files.map(async (file) => {
    // btoa works in all runtimes; Buffer is Node-only
    const b64 = typeof Buffer !== "undefined"
      ? Buffer.from(file.content).toString("base64")
      : btoa(unescape(encodeURIComponent(file.content)))

    const blobRes = await fetch(`${base}/repos/${repo}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content: b64, encoding: "base64" }),
    })
    const { sha: blobSha } = await blobRes.json() as { sha: string }
    return { path: file.path, mode: "100644", type: "blob", sha: blobSha }
  }))

  // 4. Create new tree
  const newTreeRes = await fetch(`${base}/repos/${repo}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({ base_tree: treeSha, tree: treeItems }),
  })
  const { sha: newTreeSha } = await newTreeRes.json() as { sha: string }

  // 5. Create commit
  const newCommitRes = await fetch(`${base}/repos/${repo}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message: commitMessage,
      tree:    newTreeSha,
      parents: [baseSha],
    }),
  })
  const { sha: newCommitSha } = await newCommitRes.json() as { sha: string }

  // 6. Update branch ref
  const updateRes = await fetch(`${base}/repos/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ sha: newCommitSha }),
  })

  if (updateRes.ok) {
    console.log(`[github-sync] Committed ${files.map(f => f.path).join(", ")} → ${newCommitSha.slice(0, 7)}`)
  } else {
    console.error("[github-sync] Failed to update branch ref:", await updateRes.text())
  }
}
