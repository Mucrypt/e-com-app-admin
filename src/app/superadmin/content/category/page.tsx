'use client'
import { useCategories } from '@/hooks/useCategories'
import { useState } from 'react'
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/CategoryColor.module.css'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function SuperAdminCategoryPage() {
  const { categories, loading, error } = useCategories()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description &&
        cat.description.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }
  const toggleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([])
    else setSelected(filtered.map((cat) => cat.id))
  }

  // Placeholder bulk action handler
  const handleBulkAction = () => {
    if (!bulkAction) return
    // Implement actual bulk logic here
    setBulkAction('')
    setSelected([])
    alert(`Bulk action '${bulkAction}' applied to selected categories.`)
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Category Management</h1>
        <div className='flex flex-wrap gap-3'>
          <Link href='/superadmin/content/category/create'>
            <button className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'>
              <FaPlus className='text-sm' />
              <span>Add Category</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
          <div className='flex flex-col md:flex-row md:items-center gap-4'>
            <div className='text-blue-800'>
              {selected.length}{' '}
              {selected.length === 1 ? 'category' : 'categories'} selected
            </div>
            <div className='flex-1 flex flex-wrap gap-3'>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                title='Bulk actions'
              >
                <option value=''>Bulk Actions</option>
                <option value='activate'>Activate</option>
                <option value='archive'>Archive</option>
                <option value='delete'>Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className={`px-4 py-1 rounded-md ${
                  bulkAction
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Apply
              </button>
              <button
                onClick={() => setSelected([])}
                className='text-blue-600 hover:text-blue-800'
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='bg-white p-4 rounded-lg shadow border border-gray-200'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
          <div className='relative flex-grow max-w-md'>
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
            <input
              type='text'
              placeholder='Search categories by name or description...'
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <LoadingSpinner message='Loading categories...' />
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <table className='min-w-full border rounded'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='px-4 py-2 text-left w-12'>
                  <input
                    type='checkbox'
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                    onChange={toggleSelectAll}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    title='Select all categories'
                  />
                </th>
                <th className='px-4 py-2 text-left'>Image</th>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Description</th>
                <th className='px-4 py-2 text-left'>Icon</th>
                <th className='px-4 py-2 text-left'>Color</th>
                <th className='px-2 py-2 text-left whitespace-nowrap text-sm'>
                  Status
                </th>
                <th className='px-2 py-2 text-left whitespace-nowrap text-sm'>
                  Sort Order
                </th>
                <th className='px-2 py-2 text-left whitespace-nowrap text-sm'>
                  Created At
                </th>
                <th className='px-2 py-2 text-left whitespace-nowrap text-sm'>
                  Updated At
                </th>
                <th className='px-4 py-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} className='border-t'>
                  <td className='px-4 py-2'>
                    <input
                      type='checkbox'
                      checked={selected.includes(cat.id)}
                      onChange={() => toggleSelect(cat.id)}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      title={`Select ${cat.name}`}
                    />
                  </td>
                  <td className='px-4 py-2'>
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        width={40}
                        height={40}
                        className='rounded object-cover border'
                      />
                    ) : (
                      <span className='h-10 w-10 rounded bg-gray-200 text-gray-400 flex items-center justify-center'>
                        No Image
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-2'>{cat.name}</td>
                  <td className='px-4 py-2'>{cat.description}</td>
                  <td className='px-4 py-2'>{cat.icon}</td>
                  <td className='px-4 py-2'>
                    <span
                      className={`${styles.colorIndicator} ${
                        cat.color
                          ? styles[`color_${cat.color.replace('#', '')}`]
                          : styles.color_default
                      }`}
                    ></span>
                    <span className='ml-2'>{cat.color}</span>
                  </td>
                  <td className='px-4 py-2'>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </td>
                  <td className='px-4 py-2'>{cat.sort_order}</td>
                  <td className='px-4 py-2'>
                    {cat.created_at
                      ? new Date(cat.created_at).toLocaleDateString()
                      : ''}
                  </td>
                  <td className='px-4 py-2'>
                    {cat.updated_at
                      ? new Date(cat.updated_at).toLocaleDateString()
                      : ''}
                  </td>
                  <td className='px-4 py-2 flex gap-2'>
                    <Link
                      href={`/superadmin/content/category/${cat.id}/view`}
                      title='View'
                    >
                      <button
                        className='text-blue-600 hover:text-blue-800'
                        aria-label='View category'
                        title='View'
                      >
                        <FaEye />
                      </button>
                    </Link>
                    <Link
                      href={`/superadmin/content/category/${cat.id}/edit`}
                      title='Edit'
                    >
                      <button
                        className='text-green-600 hover:text-green-800'
                        title='Edit'
                        aria-label='Edit category'
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      title='Delete'
                      className='text-red-600 hover:text-red-800'
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
