// src/components/common/LoadingSpinner.tsx
'use client'

import PropTypes from 'prop-types'
import styles from '@/styles/LoadingSpinner.module.css'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'professional'
}

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'default' 
}: LoadingSpinnerProps) => {
  
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`rounded-full border-2 border-gray-300 border-t-blue-500 ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
          }`}
        />
        {message && (
          <span className={`text-gray-600 dark:text-gray-400 ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          }`}>
            {message}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'professional') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`rounded-full border-4 border-gray-200 border-t-blue-500 ${
              size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
            }`}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-1 rounded-full border-2 border-gray-100 border-b-purple-500 ${
              size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'
            }`}
          />
        </div>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-gray-600 dark:text-gray-400 text-center ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  // Default variant (original design)
  return (
    <div className={styles.container}>
      {/* Multi-colored spinner */}
      <div className={styles.spinnerContainer}>
        <div className={`${styles.spinnerLayer} ${styles.spinnerSlow}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerMedium}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerFast}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerSlower}`}></div>

        {/* Center dot */}
        <div className={styles.centerDotContainer}>
          <div className={styles.centerDot}></div>
        </div>
      </div>

      {/* Animated text */}
      <p className={styles.animatedText}>{message}</p>

      {/* Bouncing dots */}
      <div className={styles.dotsContainer}>
        <div className={`${styles.bounceDot} ${styles.bounce1}`}></div>
        <div className={`${styles.bounceDot} ${styles.bounce2}`}></div>
        <div className={`${styles.bounceDot} ${styles.bounce3}`}></div>
      </div>
    </div>
  )
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'minimal', 'professional']),
}

export default LoadingSpinner
