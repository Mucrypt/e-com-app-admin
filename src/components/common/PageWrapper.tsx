'use client'

import React, { ReactNode, Suspense } from 'react'
import { usePageLoading } from '@/providers/app-loading-provider'
import LoadingScreen from './LoadingScreen'

interface PageWrapperProps {
  children: ReactNode
  loadingMessage?: string
}

// Component that uses the page loading hook
function PageLoadingHandler({ children, loadingMessage }: PageWrapperProps) {
  usePageLoading()
  return <>{children}</>
}

// Skeleton component for page content
function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
      
      {/* Content blocks skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PageWrapper({ children, loadingMessage }: PageWrapperProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageLoadingHandler loadingMessage={loadingMessage}>
        <LoadingScreen variant="page" message={loadingMessage} />
        {children}
      </PageLoadingHandler>
    </Suspense>
  )
}