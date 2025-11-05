'use client'

import React from 'react'
import { useAppLoading } from '@/providers/app-loading-provider'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  variant?: 'initial' | 'route' | 'page'
  message?: string
}

export default function LoadingScreen({ variant = 'initial', message }: LoadingScreenProps) {
  const { isInitialLoading, isRouteLoading, isPageLoading, progress } = useAppLoading()

  const shouldShow = 
    (variant === 'initial' && isInitialLoading) ||
    (variant === 'route' && isRouteLoading) ||
    (variant === 'page' && isPageLoading)

  if (!shouldShow) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_theme(colors.blue.500),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_theme(colors.purple.500),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_theme(colors.pink.500),_transparent_50%)]" />
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Brand Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">M</span>
            </div>
            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-2xl border-4 border-blue-300 animate-ping opacity-20" />
          </motion.div>

          {/* Animated Spinner */}
          <div className="relative w-32 h-32">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
            />
            {/* Middle Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 border-l-pink-500"
            />
            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 border-r-blue-500"
            />
            {/* Center Pulse */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-80 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            />
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {variant === 'initial' ? 'Mukulah Admin' : 'Loading...'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {message || getLoadingMessage(progress, variant)}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {progress}% Complete
            </div>
          </motion.div>

          {/* Animated Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Professional E-commerce Admin Platform</p>
          <p className="mt-1">Secure • Fast • Reliable</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function getLoadingMessage(progress: number, variant: 'initial' | 'route' | 'page'): string {
  if (variant === 'route') return 'Navigating...'
  if (variant === 'page') return 'Loading page...'

  if (progress < 20) return 'Initializing application...'
  if (progress < 40) return 'Authenticating session...'
  if (progress < 60) return 'Setting up environment...'
  if (progress < 80) return 'Loading resources...'
  if (progress < 95) return 'Finalizing setup...'
  return 'Almost ready!'
}