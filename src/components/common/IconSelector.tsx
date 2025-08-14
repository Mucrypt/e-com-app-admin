'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSearch } from 'react-icons/fa'

const icons = [
  'shopping-bag',
  'mobile',
  'laptop',
  'tshirt',
  'home',
  'utensils',
  'book',
  'gamepad',
  'music',
  'camera',
  'car',
  'bicycle',
  'baby-carriage',
  'dog',
  'cat',
  'tree',
  'leaf',
  'umbrella-beach',
  'plane',
  'ship',
  'tools',
  'paint-brush',
  'lightbulb',
  'gift',
  'star',
  'heart',
  'bell',
  'tag',
  'shopping-cart',
  'credit-card',
]

export default function IconSelector({
  selectedIcon,
  onSelect,
  onClose,
}: {
  selectedIcon: string
  onSelect: (icon: string) => void
  onClose: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(icons)
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

  useEffect(() => {
    if (searchTerm) {
      setFilteredIcons(
        icons.filter((icon) =>
          icon.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredIcons(icons)
    }
  }, [searchTerm])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        ref={pickerRef}
        className='absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-200 dark:border-gray-700'
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-medium text-gray-900 dark:text-white'>
            Select Icon
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
            aria-label='Close'
          >
            <FaTimes />
            <span className='sr-only'>Close</span>
          </button>
        </div>

        <div className='relative mb-4'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaSearch className='text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search icons...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>

        <div className='grid grid-cols-5 gap-3 max-h-60 overflow-y-auto'>
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => onSelect(icon)}
              className={`p-2 rounded-md flex flex-col items-center justify-center ${
                selectedIcon === icon
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={icon}
              aria-label={`Select ${icon} icon`}
            >
              <i
                className={`fas fa-${icon} text-lg mb-1 ${
                  selectedIcon === icon
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              ></i>
              <span className='text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center'>
                {icon}
              </span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className='py-4 text-center text-gray-500 dark:text-gray-400'>
            No icons found matching your search
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
