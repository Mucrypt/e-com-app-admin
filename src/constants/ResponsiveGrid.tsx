'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  autoFit?: boolean
  minItemWidth?: string
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
  gap = {
    xs: 4,
    sm: 4,
    md: 6,
    lg: 6,
    xl: 8,
    '2xl': 8,
  },
  autoFit = false,
  minItemWidth = '280px',
}) => {
  const { isSm, isMd, isLg, isXl, is2xl } = useResponsive()

  const getGridCols = () => {
    if (is2xl)
      return `grid-cols-${
        cols['2xl'] || cols.xl || cols.lg || cols.md || cols.sm || cols.xs || 1
      }`
    if (isXl)
      return `grid-cols-${
        cols.xl || cols.lg || cols.md || cols.sm || cols.xs || 1
      }`
    if (isLg)
      return `grid-cols-${cols.lg || cols.md || cols.sm || cols.xs || 1}`
    if (isMd) return `grid-cols-${cols.md || cols.sm || cols.xs || 1}`
    if (isSm) return `grid-cols-${cols.sm || cols.xs || 1}`
    return `grid-cols-${cols.xs || 1}`
  }

  const getGap = () => {
    if (is2xl)
      return `gap-${
        gap['2xl'] || gap.xl || gap.lg || gap.md || gap.sm || gap.xs || 4
      }`
    if (isXl)
      return `gap-${gap.xl || gap.lg || gap.md || gap.sm || gap.xs || 4}`
    if (isLg) return `gap-${gap.lg || gap.md || gap.sm || gap.xs || 4}`
    if (isMd) return `gap-${gap.md || gap.sm || gap.xs || 4}`
    if (isSm) return `gap-${gap.sm || gap.xs || 4}`
    return `gap-${gap.xs || 4}`
  }

  const gridClasses = autoFit
    ? `grid grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`
    : `grid ${getGridCols()}`

  return <div className={cn(gridClasses, getGap(), className)}>{children}</div>
}
