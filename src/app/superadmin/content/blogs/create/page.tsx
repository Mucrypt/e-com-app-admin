// app/superadmin/content/blogs/create/page.tsx - WORLD CLASS MASTERPIECE
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BlogService } from '@/lib/blog-service'
import { CreateBlogData } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Eye,
  Upload,
  Image as ImageIcon,
  Zap,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Settings,
  Sparkles,
  Brain,
  Rocket,
  Target,
  Users,
  BarChart3,
  Clock,
  Tag,
  FolderOpen,
  Send,
  TrendingUp,
  EyeOff,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'

// Dynamically import the rich text editor for better performance
const CosmicRichTextEditor = dynamic(
  () =>
    import('@/components/rich-text-editor').then((mod) => ({
      default: mod.CosmicRichTextEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className='h-96 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl animate-pulse flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading Cosmic Editor...</p>
        </div>
      </div>
    ),
  }
)

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

// AI Content Generator Component
const AIContentWizard = ({
  onContentGenerated,
  type,
}: {
  onContentGenerated: (content: string, type: string) => void
  type: 'title' | 'excerpt' | 'content'
}) => {
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')

  const generateContent = async () => {
    if (!prompt.trim() && type === 'content') return

    setGenerating(true)
    try {
      // Simulate AI API call with enhanced content
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const aiResponses = {
        title:
          'The Future of AI in Content Creation: Revolutionizing Digital Experiences',
        excerpt:
          'Discover how artificial intelligence is transforming content creation, enabling unprecedented personalization and engagement in the digital landscape.',
        content: `<div class="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-l-4 border-blue-500 mb-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">🚀 The AI Content Revolution</h2>
          <p class="text-lg text-gray-700 leading-relaxed">Artificial intelligence is fundamentally changing how we create, distribute, and optimize content. From automated writing assistants to predictive analytics, AI empowers creators to deliver more impactful and personalized experiences.</p>
        </div>
        <h3>Key Benefits of AI-Powered Content</h3>
        <ul class="space-y-3 my-4">
          <li class="flex items-start">
            <div class="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <CheckCircle class="w-4 h-4 text-green-600" />
            </div>
            <span class="text-gray-700">Enhanced creativity and ideation</span>
          </li>
          <li class="flex items-start">
            <div class="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <CheckCircle class="w-4 h-4 text-green-600" />
            </div>
            <span class="text-gray-700">Improved SEO optimization</span>
          </li>
          <li class="flex items-start">
            <div class="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <CheckCircle class="w-4 h-4 text-green-600" />
            </div>
            <span class="text-gray-700">Personalized audience engagement</span>
          </li>
        </ul>`,
      }

      onContentGenerated(aiResponses[type], type)
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setGenerating(false)
      setPrompt('')
    }
  }

  return (
    <div className='space-y-4'>
      {type === 'content' && (
        <Input
          placeholder='Describe what you want to create...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='bg-white/80 border-blue-200 focus:border-blue-500'
        />
      )}
      <Button
        onClick={generateContent}
        disabled={generating || (type === 'content' && !prompt.trim())}
        className={`w-full ${
          generating
            ? 'bg-gradient-to-r from-gray-500 to-gray-600'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
        } text-white shadow-2xl hover:shadow-3xl transition-all duration-300`}
      >
        {generating ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
            AI is Creating Magic...
          </>
        ) : (
          <>
            <Brain className='w-4 h-4 mr-2' />
            {type === 'title' && 'Generate Captivating Title'}
            {type === 'excerpt' && 'Craft Compelling Excerpt'}
            {type === 'content' && 'Create AI Masterpiece'}
          </>
        )}
      </Button>
    </div>
  )
}

function CreateBlogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  )
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    author_name: 'Super Admin',
    author_email: 'admin@example.com',
    read_time: '',
    is_featured: false,
    is_published: false,
    meta_title: '',
    meta_description: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  // const [aiGenerating, setAiGenerating] = useState(false)

  // Load pre-filled content from URL if available
  useEffect(() => {
    const content = searchParams?.get('content')
    if (content) {
      setFormData((prev: CreateBlogData) => ({ ...prev, content: decodeURIComponent(content) }))
    }
  }, [searchParams])

  // Simulate progress for better UX
  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 100
          }
          const diff = Math.random() * 10
          return Math.min(oldProgress + diff, 90)
        })
      }, 200)
      return () => {
        clearInterval(timer)
      }
    }
  }, [loading])

  const handleContentGenerated = (content: string, type: string) => {
    setFormData((prev: CreateBlogData) => ({
      ...prev,
      [type]: type === 'content' ? prev.content + content : content,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev: number) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      await BlogService.createBlog(formData)

      setProgress(100)
      setTimeout(() => {
        router.push('/superadmin/content/blogs')
      }, 500)
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      // Simulate draft saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Draft saved:', formData)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev: CreateBlogData) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: CreateBlogData) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || [],
    }))
  }

  const handleImageUpload = () => {
    // Simulate image upload
    const imageUrl =
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    setFormData((prev: CreateBlogData) => ({ ...prev, featured_image_url: imageUrl }))
  }

  const containerClasses = {
    desktop: 'grid-cols-1 lg:grid-cols-4',
    tablet: 'grid-cols-1 max-w-4xl',
    mobile: 'grid-cols-1 max-w-md',
  }

  return (
    <div className='overflow-y-auto max-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 '>
      {/* Enhanced Sticky Header */}
      <div className='bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm '>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link href='/superadmin/content/blogs'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='group hover:bg-blue-50 transition-all duration-300'
                >
                  <ArrowLeft className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform' />
                  Back to Content Studio
                </Button>
              </Link>
              <div className='w-px h-6 bg-gray-200'></div>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent'>
                  Create Cosmic Content
                </h1>
                <p className='text-gray-600 text-sm'>
                  Craft stories that inspire and engage your audience
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              {/* Device Preview Toggle */}
              <div className='flex bg-gray-100 rounded-xl p-1 shadow-inner'>
                {[
                  { view: 'mobile', icon: Smartphone, label: 'Mobile' },
                  { view: 'tablet', icon: Tablet, label: 'Tablet' },
                  { view: 'desktop', icon: Monitor, label: 'Desktop' },
                ].map(({ view, icon: Icon, label }) => (
                  <button
                    key={view}
                    onClick={() =>
                      setDeviceView(view as 'desktop' | 'tablet' | 'mobile')
                    }
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      deviceView === view
                        ? 'bg-white shadow-lg text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={`Switch to ${label} view`}
                  >
                    <Icon className='w-4 h-4' />
                  </button>
                ))}
              </div>

              {/* Preview Toggle */}
              <Button
                variant='outline'
                onClick={() => setPreviewMode(!previewMode)}
                className='flex items-center space-x-2 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors'
              >
                {previewMode ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
                <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
              </Button>

              <Button
                type='submit'
                form='blog-form'
                disabled={loading}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <Rocket className='w-4 h-4 mr-2 group-hover:rotate-45 transition-transform' />
                {loading ? 'Launching...' : 'Publish Masterpiece'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 py-8 space-y-2 '>
        {/* Progress Bar */}
        {loading && (
          <div className='px-6 pt-4'>
            <div className='max-w-4xl mx-auto'>
              <Progress value={progress} className='h-2 bg-gray-200' />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>Preparing your content...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        )}
        <form id='blog-form' onSubmit={handleSubmit}>
          <div className={`grid ${containerClasses[deviceView]} gap-8 mx-auto`}>
            {/* Main Content Area */}
            <div
              className={`${
                deviceView === 'desktop' ? 'lg:col-span-3' : ''
              } space-y-6`}
            >
              {/* AI Assistant Card */}
              <Card className='bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50 shadow-2xl backdrop-blur-sm'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg'>
                        <Brain className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h3 className='font-bold text-gray-900 text-lg'>
                          Cosmic AI Assistant
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Let AI help you create extraordinary content
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-700'
                    >
                      <Sparkles className='w-3 h-3 mr-1' />
                      AI Powered
                    </Badge>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
                    <AIContentWizard
                      onContentGenerated={handleContentGenerated}
                      type='title'
                    />
                    <AIContentWizard
                      onContentGenerated={handleContentGenerated}
                      type='excerpt'
                    />
                    <AIContentWizard
                      onContentGenerated={handleContentGenerated}
                      type='content'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
                <CardContent className='p-0'>
                  {previewMode ? (
                    // Preview Mode
                    <div className='p-8 prose prose-lg max-w-none'>
                      <div className='text-center mb-8'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                          {formData.title}
                        </h1>
                        {formData.excerpt && (
                          <p className='text-xl text-gray-600 leading-relaxed'>
                            {formData.excerpt}
                          </p>
                        )}
                      </div>
                      {formData.featured_image_url && (
                        <NextImage
                          src={formData.featured_image_url}
                          alt='Featured'
                          width={800}
                          height={400}
                          className='w-full h-64 object-cover rounded-2xl mb-8 shadow-lg'
                        />
                      )}
                      <div
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                        className='mt-6'
                      />
                    </div>
                  ) : (
                    // Edit Mode
                    <div className='p-6 space-y-6'>
                      <div>
                        <label className='text-sm font-semibold text-gray-900 mb-3 flex items-center'>
                          <Target className='w-4 h-4 mr-2 text-blue-600' />
                          Title *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev: CreateBlogData) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder='Craft a title that stops scrolls and sparks curiosity...'
                          className='text-2xl font-bold border-0 bg-gray-50/50 focus:bg-white p-6 focus:ring-2 focus:ring-blue-500 rounded-2xl transition-all duration-300'
                          required
                        />
                      </div>

                      <div>
                        <label className='text-sm font-semibold text-gray-900 mb-3 flex items-center'>
                          <Users className='w-4 h-4 mr-2 text-green-600' />
                          Excerpt *
                        </label>
                        <Textarea
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData((prev: CreateBlogData) => ({
                              ...prev,
                              excerpt: e.target.value,
                            }))
                          }
                          placeholder='Write a compelling description that makes readers excited to dive in...'
                          rows={3}
                          className='border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none rounded-2xl p-4 text-lg transition-all duration-300'
                          required
                        />
                      </div>

                      <div>
                        <div className='flex items-center justify-between mb-3'>
                          <label className='text-sm font-semibold text-gray-900 flex items-center'>
                            <Zap className='w-4 h-4 mr-2 text-purple-600' />
                            Content *
                          </label>
                          <div className='flex items-center space-x-2 text-sm text-gray-500'>
                            <BarChart3 className='w-4 h-4' />
                            <span>AI Score: 98%</span>
                          </div>
                        </div>
                        <CosmicRichTextEditor
                          value={formData.content}
                          onChange={(content: string) =>
                            setFormData((prev: CreateBlogData) => ({ ...prev, content }))
                          }
                          className='min-h-[600px]'
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Sticky Container */}
            {deviceView === 'desktop' && (
              <div className='space-y-6 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto'>
                {/* Publish Settings */}
                <Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
                  <CardHeader className='bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100'>
                    <CardTitle className='flex items-center space-x-2 text-gray-900'>
                      <Settings className='w-5 h-5 text-blue-600' />
                      <span>Launch Controls</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-6 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Sparkles className='w-4 h-4 mr-2 text-yellow-600' />
                        Featured Post
                      </label>
                      <input
                        type='checkbox'
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData((prev: CreateBlogData) => ({
                            ...prev,
                            is_featured: e.target.checked,
                          }))
                        }
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 transform scale-125'
                        title='Mark as featured post'
                        placeholder='Mark as featured post'
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Send className='w-4 h-4 mr-2 text-green-600' />
                        Publish Immediately
                      </label>
                      <input
                        type='checkbox'
                        checked={formData.is_published}
                        onChange={(e) =>
                          setFormData((prev: CreateBlogData) => ({
                            ...prev,
                            is_published: e.target.checked,
                          }))
                        }
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 transform scale-125'
                        title='Publish immediately'
                      />
                    </div>

                    <div className='pt-4 border-t border-gray-100 space-y-3'>
                      <Button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300'
                      >
                        {loading ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                            Launching...
                          </>
                        ) : (
                          <>
                            <Rocket className='w-4 h-4 mr-2' />
                            Publish Masterpiece
                          </>
                        )}
                      </Button>

                      <Button
                        type='button'
                        variant='outline'
                        className='w-full border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors'
                        onClick={handleSaveDraft}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Download className='w-4 h-4 mr-2' />
                            Save Draft
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Blog Details */}
                <Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
                  <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100'>
                    <CardTitle className='flex items-center space-x-2 text-gray-900'>
                      <Globe className='w-5 h-5 text-green-600' />
                      <span>Content Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-6 space-y-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <FolderOpen className='w-4 h-4 mr-2 text-blue-600' />
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev: CreateBlogData) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className='w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50 p-3 transition-all duration-300'
                        required
                        title='Select a category'
                      >
                        <option value=''>Choose a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <Clock className='w-4 h-4 mr-2 text-orange-600' />
                        Read Time
                      </label>
                      <Input
                        value={formData.read_time}
                        onChange={(e) =>
                          setFormData((prev: CreateBlogData) => ({
                            ...prev,
                            read_time: e.target.value,
                          }))
                        }
                        placeholder='e.g., 5 min read'
                        className='bg-gray-50/50 rounded-xl p-3 transition-all duration-300'
                      />
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <Tag className='w-4 h-4 mr-2 text-purple-600' />
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
                            placeholder='Add relevant tags...'
                            className='flex-1 bg-gray-50/50 rounded-xl transition-all duration-300'
                          />
                          <Button
                            type='button'
                            onClick={handleAddTag}
                            variant='outline'
                            className='border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors'
                          >
                            Add
                          </Button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {formData.tags?.map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer group'
                              onClick={() => handleRemoveTag(tag)}
                            >
                              {tag}
                              <span className='ml-1 group-hover:text-red-600 transition-colors'>
                                ×
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
                  <CardHeader className='bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100'>
                    <CardTitle className='flex items-center space-x-2 text-gray-900'>
                      <ImageIcon className='w-5 h-5 text-orange-600' />
                      <span>Featured Image</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='p-6'>
                    {formData.featured_image_url ? (
                      <div className='space-y-3'>
                        <div className='relative rounded-2xl overflow-hidden shadow-lg'>
                          <NextImage
                            src={formData.featured_image_url}
                            alt='Featured blog image'
                            width={400}
                            height={200}
                            className='w-full h-48 object-cover transition-transform hover:scale-105 duration-500'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                            <span className='text-white text-sm'>
                              Click to change
                            </span>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='w-full border-red-200 text-red-600 hover:bg-red-50 transition-colors'
                          onClick={() =>
                            setFormData((prev: CreateBlogData) => ({
                              ...prev,
                              featured_image_url: '',
                            }))
                          }
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div
                        className='border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-all duration-300 cursor-pointer group bg-gray-50/50'
                        onClick={handleImageUpload}
                      >
                        <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors' />
                        <p className='text-sm text-gray-600 mb-2 font-medium'>
                          Upload stunning featured image
                        </p>
                        <p className='text-xs text-gray-500'>
                          Recommended: 1200×630px
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className='shadow-2xl border-0 bg-gradient-to-br from-gray-900 to-blue-900 text-white'>
                  <CardHeader className='border-b border-white/20'>
                    <CardTitle className='flex items-center space-x-2'>
                      <TrendingUp className='w-5 h-5 text-green-400' />
                      <span>Performance Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-6 space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-blue-200'>Readability Score</span>
                        <span className='font-bold text-green-400'>98%</span>
                      </div>
                      <Progress value={98} className='h-2 bg-white/20' />

                      <div className='flex justify-between text-sm'>
                        <span className='text-blue-200'>SEO Score</span>
                        <span className='font-bold text-green-400'>95%</span>
                      </div>
                      <Progress value={95} className='h-2 bg-white/20' />

                      <div className='flex justify-between text-sm'>
                        <span className='text-blue-200'>
                          Engagement Potential
                        </span>
                        <span className='font-bold text-green-400'>92%</span>
                      </div>
                      <Progress value={92} className='h-2 bg-white/20' />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateBlogPageContent />
    </Suspense>
  )
}
