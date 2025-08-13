'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '',
    icon: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement
    const { name, value, type } = target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // TODO: Add API call to create category
    setTimeout(() => {
      setLoading(false)
      router.push('/superadmin/content/category')
    }, 1000)
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      <button
        className='mb-4 flex items-center text-blue-600 hover:text-blue-800'
        onClick={() => router.back()}
      >
        <FaArrowLeft className='mr-2' /> Back
      </button>
      <h1 className='text-2xl font-bold mb-6'>Create Category</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <input
          name='name'
          value={form.name}
          onChange={handleChange}
          placeholder='Name'
          required
          className='w-full border rounded px-3 py-2'
        />
        <textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          placeholder='Description'
          className='w-full border rounded px-3 py-2'
        />
        <input
          name='color'
          value={form.color}
          onChange={handleChange}
          placeholder='Color (e.g. #ff0000)'
          className='w-full border rounded px-3 py-2'
        />
        <input
          name='icon'
          value={form.icon}
          onChange={handleChange}
          placeholder='Icon (e.g. fa-star)'
          className='w-full border rounded px-3 py-2'
        />
        <input
          name='image_url'
          value={form.image_url}
          onChange={handleChange}
          placeholder='Image URL'
          className='w-full border rounded px-3 py-2'
        />
        <input
          name='sort_order'
          type='number'
          value={form.sort_order}
          onChange={handleChange}
          placeholder='Sort Order'
          className='w-full border rounded px-3 py-2'
        />
        <label className='flex items-center gap-2'>
          <input
            name='is_active'
            type='checkbox'
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
        {error && <div className='text-red-500'>{error}</div>}
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  )
}
