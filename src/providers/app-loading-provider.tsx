'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AppLoadingContextType {
  isInitialLoading: boolean
  isRouteLoading: boolean
  isPageLoading: boolean
  setPageLoading: (loading: boolean) => void
  progress: number
}

const AppLoadingContext = createContext<AppLoadingContextType | undefined>(undefined)

interface AppLoadingProviderProps {
  children: ReactNode
}

export function AppLoadingProvider({ children }: AppLoadingProviderProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  // Simulate initial app loading with progressive steps
  useEffect(() => {
    const loadingSteps = [
      { step: 'Initializing app...', progress: 20, delay: 300 },
      { step: 'Loading authentication...', progress: 40, delay: 400 },
      { step: 'Setting up environment...', progress: 60, delay: 350 },
      { step: 'Loading resources...', progress: 80, delay: 400 },
      { step: 'Finalizing...', progress: 95, delay: 200 },
      { step: 'Ready!', progress: 100, delay: 300 }
    ]

    let currentStep = 0
    const executeStep = () => {
      if (currentStep < loadingSteps.length) {
        const { progress: stepProgress, delay } = loadingSteps[currentStep]
        setProgress(stepProgress)
        
        setTimeout(() => {
          currentStep++
          if (currentStep < loadingSteps.length) {
            executeStep()
          } else {
            // Complete loading
            setTimeout(() => {
              setIsInitialLoading(false)
            }, 500)
          }
        }, delay)
      }
    }

    executeStep()
  }, [])

  // Route change loading detection
  useEffect(() => {
    const handleRouteStart = () => {
      setIsRouteLoading(true)
      setProgress(0)
      
      // Simulate route loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 100)
    }

    const handleRouteComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setIsRouteLoading(false)
        setProgress(0)
      }, 300)
    }

    // For Next.js route changes, we'll listen to beforeunload and load events
    const handleBeforeUnload = () => handleRouteStart()
    const handleLoad = () => handleRouteComplete()

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  const value: AppLoadingContextType = {
    isInitialLoading,
    isRouteLoading,
    isPageLoading,
    setPageLoading: setIsPageLoading,
    progress
  }

  return (
    <AppLoadingContext.Provider value={value}>
      {children}
    </AppLoadingContext.Provider>
  )
}

export function useAppLoading() {
  const context = useContext(AppLoadingContext)
  if (context === undefined) {
    throw new Error('useAppLoading must be used within an AppLoadingProvider')
  }
  return context
}

// Hook for page-level loading
export function usePageLoading() {
  const { setPageLoading } = useAppLoading()
  
  useEffect(() => {
    setPageLoading(true)
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 100)
    
    return () => {
      clearTimeout(timer)
      setPageLoading(false)
    }
  }, [setPageLoading])
}