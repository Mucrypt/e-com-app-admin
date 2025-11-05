'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppLoading } from '@/providers/app-loading-provider'

export default function ProgressBar() {
  const { isRouteLoading, progress } = useAppLoading()

  return (
    <AnimatePresence>
      {isRouteLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gray-200 dark:bg-gray-800"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
          />
          {/* Shimmer Effect */}
          <motion.div
            animate={{ x: [-100, 200] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}