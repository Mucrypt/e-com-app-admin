'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaTimes, FaSearch, FaFolder, FaFolderOpen } from 'react-icons/fa'

interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export default function ParentCategorySelector({ 
  categories, 
  selectedId, 
  onSelect, 
  onClose 
}: {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const rootCategories = categories.filter(cat => !cat.parent_id)
  const filteredCategories = searchTerm 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rootCategories

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = categories.some(cat => cat.parent_id === category.id)
    const isExpanded = expandedCategories[category.id]
    
    return (
      <div key={category.id} className="space-y-1">
        <div 
          className={`flex items-center justify-between p-2 rounded-md ${selectedId === category.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <div className="flex items-center">
            <span className="mr-2" style={{ marginLeft: `${level * 16}px` }}>
              {hasChildren ? (
                isExpanded ? (
                  <FaFolderOpen className="text-yellow-500" />
                ) : (
                  <FaFolder className="text-yellow-500" />
                )
              ) : (
                <span className="ml-5"></span>
              )}
            </span>
            <span className="truncate">{category.name}</span>
          </div>
          <div className="flex items-center">
            {hasChildren && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isExpanded ? (
                  <FaTimes size={12} />
                ) : (
                  <FaCheck size={12} />
                )}
              </button>
            )}
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {categories
              .filter(cat => cat.parent_id === category.id)
              .map(child => renderCategory(child, level + 1))
            }
          </div>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        ref={pickerRef}
        className="absolute z-50 mt-2 w-96 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Select Parent Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="space-y-1">
          <div 
            className={`flex items-center p-2 rounded-md ${!selectedId ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => onSelect('')}
          >
            <span className="ml-5 mr-2"></span>
            <span>No parent (root category)</span>
          </div>
          
          {filteredCategories.map(category => renderCategory(category))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
            No categories found matching your search
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}