'use client'

import React, { ReactNode } from 'react'
import { AppLoadingProvider } from '@/providers/app-loading-provider'
import LoadingScreen from '@/components/common/LoadingScreen'
import ProgressBar from '@/components/common/ProgressBar'

interface AppWrapperProps {
  children: ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <AppLoadingProvider>
      {/* Progress bar for route transitions */}
      <ProgressBar />
      
      {/* Initial app loading screen */}
      <LoadingScreen variant="initial" />
      
      {/* Main app content */}
      <div className="relative">
        {children}
      </div>
    </AppLoadingProvider>
  )
}