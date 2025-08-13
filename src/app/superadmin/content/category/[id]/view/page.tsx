'use client'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { FaArrowLeft } from 'react-icons/fa'

export default function ViewCategoryPage() {
  const router = useRouter()
  const params = useParams()
  // TODO: Fetch category by params.id
  const category = {
    id: params.id,
    name: 'Sample Category',
    description: 'This is a sample category.',
    color: '#ff0000',
    icon: 'fa-star',
    image_url: '',
    sort_order: 1,
    is_active: true,
    created_at: '2025-08-13',
    updated_at: '2025-08-13',
  }
  return (
    <div className='max-w-xl mx-auto p-6'>
      <button
        className='mb-4 flex items-center text-blue-600 hover:text-blue-800'
        onClick={() => router.back()}
      >
        <FaArrowLeft className='mr-2' /> Back
      </button>
      <h1 className='text-2xl font-bold mb-6'>View Category</h1>
      <div className='space-y-2'>
        <div>
          <strong>Name:</strong> {category.name}
        </div>
        <div>
          <strong>Description:</strong> {category.description}
        </div>
        <div>
          <strong>Color:</strong>{' '}
          <span
            style={{
              background: category.color,
              padding: '0 8px',
              borderRadius: '4px',
            }}
          >
            {category.color}
          </span>
        </div>
        <div>
          <strong>Icon:</strong> {category.icon}
        </div>
        <div>
          <strong>Image:</strong>{' '}
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              width={40}
              height={40}
              className='rounded object-cover border'
            />
          ) : (
            'No Image'
          )}
        </div>
        <div>
          <strong>Sort Order:</strong> {category.sort_order}
        </div>
        <div>
          <strong>Status:</strong> {category.is_active ? 'Active' : 'Inactive'}
        </div>
        <div>
          <strong>Created At:</strong> {category.created_at}
        </div>
        <div>
          <strong>Updated At:</strong> {category.updated_at}
        </div>
      </div>
    </div>
  )
}
