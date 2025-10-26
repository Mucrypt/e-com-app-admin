'use client'
import React, { createContext, useContext } from 'react'
import { useResponsive } from '@/hooks/useResponsive'

type ResponsiveContextType = ReturnType<typeof useResponsive>

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined
)

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const responsive = useResponsive()

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  )
}

export const useResponsiveContext = () => {
  const context = useContext(ResponsiveContext)
  if (context === undefined) {
    throw new Error(
      'useResponsiveContext must be used within a ResponsiveProvider'
    )
  }
  return context
}
