'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaTimes } from 'react-icons/fa'

const colors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#6366F1',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#8B5CF6',
  '#F43F5E',
  '#06B6D4',
  '#84CC16',
  '#EAB308',
  '#A855F7',
  '#D946EF',
]

export default function ColorPicker({
  color,
  onChange,
  onClose,
}: {
  color: string
  onChange: (color: string) => void
  onClose: () => void
}) {
  const [customColor, setCustomColor] = useState(color)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        ref={pickerRef}
        className='absolute z-50 mt-2 w-72 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-200 dark:border-gray-700'
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-medium text-gray-900 dark:text-white'>
            Select Color
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
            aria-label='Close'
          >
            <FaTimes />
            <span className='sr-only'>Close</span>
          </button>
        </div>

        <div className='grid grid-cols-5 gap-3 mb-4'>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setCustomColor(c)}
              className='w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition-all'
              style={{ backgroundColor: c }}
              title={c}
            >
              {customColor === c && (
                <span className='flex items-center justify-center h-full text-white'>
                  <FaCheck size={12} />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className='mb-4'>
          <label
            htmlFor='custom-color-input'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Custom Color
          </label>
          <div className='flex items-center'>
            <input
              id='custom-color-input'
              type='color'
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className='w-10 h-10 rounded cursor-pointer'
              title='Pick a color'
            />
            <input
              type='text'
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className='ml-3 flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white'
              placeholder='#FFFFFF'
              title='Enter color hex code'
            />
          </div>
        </div>

        <button
          onClick={() => onChange(customColor)}
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors'
        >
          Apply Color
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
