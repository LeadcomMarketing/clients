"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface BookingModalContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const BookingModalContext = createContext<BookingModalContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <BookingModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </BookingModalContext.Provider>
  )
}

export function useBookingModal() {
  return useContext(BookingModalContext)
}
