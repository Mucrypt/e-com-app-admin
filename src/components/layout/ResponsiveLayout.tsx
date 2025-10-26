'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  variant?: 'default' | 'wide' | 'narrow' | 'full'
  className?: string
}

const layoutVariants = {
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
  narrow: 'max-w-4xl',
  full: 'max-w-full',
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const { isMobile } = useResponsive()

  return (
    <div
      className={cn(
        'w-full mx-auto',
        layoutVariants[variant],
        'px-4 sm:px-6 lg:px-8',
        isMobile && 'px-4',
        className
      )}
    >
      {children}
    </div>
  )
}
