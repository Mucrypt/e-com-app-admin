'use client'
import { useState, useEffect } from 'react'

interface BreakpointConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const breakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < breakpoints.md
  const isTablet =
    windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg
  const isDesktop = windowSize.width >= breakpoints.lg
  const isXs = windowSize.width < breakpoints.sm
  const isSm =
    windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md
  const isMd =
    windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg
  const isLg =
    windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl
  const isXl =
    windowSize.width >= breakpoints.xl && windowSize.width < breakpoints['2xl']
  const is2xl = windowSize.width >= breakpoints['2xl']

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    breakpoints,
  }
}
