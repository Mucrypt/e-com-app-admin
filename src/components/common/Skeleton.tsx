import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animate?: boolean
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const baseClasses = `
    ${animate ? 'animate-pulse' : ''}
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
    bg-[length:200%_100%]
    ${animate ? 'animate-shimmer' : ''}
  `

  const variantClasses = {
    text: 'rounded-sm',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  }

  const style = {
    width: width || undefined,
    height: height || undefined,
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export default Skeleton