'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
  mobileClassName?: string
  tabletClassName?: string
  desktopClassName?: string
  enableAutoGrid?: boolean
  enableAutoSpacing?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  enableAutoGrid = false,
  enableAutoSpacing = true,
  maxWidth = 'xl',
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const baseClasses = cn(
    'w-full mx-auto',
    maxWidthClasses[maxWidth],
    enableAutoSpacing && 'px-4 sm:px-6 lg:px-8',
    enableAutoGrid &&
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
    className
  )

  const responsiveClasses = cn(
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName
  )

  return <div className={cn(baseClasses, responsiveClasses)}>{children}</div>
}
