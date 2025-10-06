// app/superadmin/content/blogs/create/page.tsx - ENHANCED EDITOR
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogService } from '@/lib/blog-service'
import { CreateBlogData } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image,
  Zap,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Settings,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'

// Dynamically import the rich text editor for better performance
const RichTextEditor = dynamic(() => import('@/components/rich-text-editor'), {
  ssr: false,
  loading: () => (
    <div className='h-96 bg-gray-100 rounded-lg animate-pulse'></div>
  ),
})

const categories = [
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Development',
  'AI & Machine Learning',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
]

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  )
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    author_name: '',
    author_email: '',
    read_time: '',
    is_featured: false,
    is_published: false,
    meta_title: '',
    meta_description: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  // AI-powered content generation
  const generateWithAI = async (type: 'title' | 'excerpt' | 'content') => {
    setAiGenerating(true)
    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aiContent = {
        title: 'The Future of AI in Content Creation: A Comprehensive Guide',
        excerpt:
          'Discover how artificial intelligence is revolutionizing content creation and what it means for the future of digital marketing.',
        content:
          '<h2>The AI Revolution in Content</h2><p>Artificial intelligence is transforming how we create, distribute, and optimize content...</p>',
      }

      setFormData((prev) => ({
        ...prev,
        [type]: aiContent[type],
      }))
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await BlogService.createBlog(formData)
      router.push('/superadmin/content/blogs')
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const deviceClasses = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-md mx-auto',
  }

  return (
      <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50/30'>
      {/* Enhanced Header */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-50'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link href='/superadmin/content/blogs'>
                <Button variant='ghost' size='sm'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back to Studio
                </Button>
              </Link>
              <div className='w-px h-6 bg-gray-200'></div>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent'>
                  Create Masterpiece
                </h1>
                <p className='text-gray-600'>
                  Craft content that captivates your audience
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              {/* Device Preview Toggle */}
              <div className='flex bg-gray-100 rounded-lg p-1'>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'mobile'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500'
                  }`}
                  title='Switch to mobile view'
                >
                  <Smartphone className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'tablet'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500'
                  }`}
                  title='Switch to tablet view'
                >
                  <Tablet className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'desktop'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500'
                  }`}
                  title='Switch to desktop view'
                >
                  <Monitor className='w-4 h-4' />
                </button>
              </div>

              {/* Preview Toggle */}
              <Button
                variant='outline'
                onClick={() => setPreviewMode(!previewMode)}
                className='flex items-center space-x-2'
              >
                <Eye className='w-4 h-4' />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </Button>

              <Button
                type='submit'
                form='blog-form'
                disabled={loading}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              >
                <Save className='w-4 h-4 mr-2' />
                {loading ? 'Publishing...' : 'Publish Masterpiece'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 py-8'>
        <form id='blog-form' onSubmit={handleSubmit}>
          <div
            className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${deviceClasses[deviceView]}`}
          >
            {/* Main Content Area */}
            <div className='lg:col-span-3 space-y-6'>
              {/* AI Assistant Card */}
              <Card className='bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg'>
                        <Sparkles className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          AI Writing Assistant
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Let AI help you create amazing content
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => generateWithAI('title')}
                        disabled={aiGenerating}
                      >
                        <Zap className='w-4 h-4 mr-1' />
                        Generate Title
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => generateWithAI('excerpt')}
                        disabled={aiGenerating}
                      >
                        <Zap className='w-4 h-4 mr-1' />
                        Generate Excerpt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className='shadow-xl border-0'>
                <CardContent className='p-6'>
                  {previewMode ? (
                    // Preview Mode
                    <div className='prose prose-lg max-w-none'>
                      <h1>{formData.title}</h1>
                      <div
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                        className='mt-6'
                      />
                    </div>
                  ) : (
                    // Edit Mode
                    <div className='space-y-6'>
                      <div>
                        <label className='block text-sm font-semibold text-gray-900 mb-3'>
                          Title *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder='Catchy title that grabs attention...'
                          className='text-2xl font-bold border-0 bg-gray-50/50 focus:bg-white p-4 focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-gray-900 mb-3'>
                          Excerpt *
                        </label>
                        <Textarea
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              excerpt: e.target.value,
                            }))
                          }
                          placeholder='Brief, compelling description that makes people want to read more...'
                          rows={3}
                          className='border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none'
                          required
                        />
                      </div>

                      <div>
                        <div className='flex items-center justify-between mb-3'>
                          <label className='block text-sm font-semibold text-gray-900'>
                            Content *
                          </label>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => generateWithAI('content')}
                            disabled={aiGenerating}
                          >
                            <Zap className='w-4 h-4 mr-1' />
                            AI Generate Content
                          </Button>
                        </div>
                        <RichTextEditor
                          value={formData.content}
                          onChange={(content) =>
                            setFormData((prev) => ({ ...prev, content }))
                          }
                          placeholder='Start writing your amazing content here... You can add images, videos, code blocks, and much more!'
                          className='min-h-[500px] border-0 bg-gray-50/50 focus:bg-white rounded-lg'
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              {/* Publish Settings */}
              <Card className='shadow-lg border-0 sticky top-24'>
                <CardHeader className='bg-gradient-to-r from-gray-50 to-blue-50/50 border-b'>
                  <CardTitle className='flex items-center space-x-2'>
                    <Settings className='w-5 h-5 text-blue-600' />
                    <span>Publish Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-6 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700'>
                      Featured Post
                    </label>
                    <input
                      type='checkbox'
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_featured: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      title='Mark as featured post'
                      placeholder='Mark as featured post'
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700'>
                      Publish Immediately
                    </label>
                    <input
                      type='checkbox'
                      checked={formData.is_published}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      title='Publish immediately'
                    />
                  </div>

                  <div className='pt-4 border-t border-gray-100'>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    >
                      <Save className='w-4 h-4 mr-2' />
                      {loading ? 'Publishing...' : 'Publish Masterpiece'}
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      className='w-full mt-3'
                    >
                      <Download className='w-4 h-4 mr-2' />
                      Save Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Blog Details */}
              <Card className='shadow-lg border-0'>
                <CardHeader className='bg-gradient-to-r from-gray-50 to-blue-50/50 border-b'>
                  <CardTitle className='flex items-center space-x-2'>
                    <Globe className='w-5 h-5 text-blue-600' />
                    <span>Blog Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-6 space-y-4'>
                  <div>
                    <label
                      htmlFor='category-select'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Category
                    </label>
                    <select
                      id='category-select'
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className='w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50'
                      required
                    >
                      <option value=''>Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Read Time
                    </label>
                    <Input
                      value={formData.read_time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          read_time: e.target.value,
                        }))
                      }
                      placeholder='e.g., 5 min read'
                      className='bg-gray-50/50'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Tags
                    </label>
                    <div className='space-y-2'>
                      <div className='flex space-x-2'>
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), handleAddTag())
                          }
                          placeholder='Add tags...'
                          className='flex-1 bg-gray-50/50'
                        />
                        <Button
                          type='button'
                          onClick={handleAddTag}
                          variant='outline'
                        >
                          Add
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {formData.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {tag}
                            <button
                              type='button'
                              onClick={() => handleRemoveTag(tag)}
                              className='ml-2 hover:text-blue-600'
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card className='shadow-lg border-0'>
                <CardHeader className='bg-gradient-to-r from-gray-50 to-blue-50/50 border-b'>
                  <CardTitle className='flex items-center space-x-2'>
                    <Image className='w-5 h-5 text-blue-600' alt='' />
                    <span>Featured Image</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className='p-6'>
                  {formData.featured_image_url ? (
                    <div>
                      <NextImage
                        src={formData.featured_image_url}
                        alt='Featured blog image'
                        width={600}
                        height={128}
                        className='w-full h-32 object-cover rounded-lg'
                        style={{
                          width: '100%',
                          height: '8rem',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                        }}
                        priority
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='w-full mt-3'
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            featured_image_url: '',
                          }))
                        }
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-sm text-gray-600 mb-2'>
                        Upload featured image
                      </p>
                      <Button type='button' variant='outline' size='sm'>
                        Choose Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
