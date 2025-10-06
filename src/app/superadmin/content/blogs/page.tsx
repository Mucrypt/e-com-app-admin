// app/superadmin/content/blogs/page.tsx - ENHANCED VERSION
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Blog, BlogFilters } from '@/types/blog'
import { BlogService } from '@/lib/blog-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  Search,
  BarChart3,
  TrendingUp,
  Zap,
  Download,
  Share2,
  MoreVertical,
  Sparkles,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({})
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0,
    total_views: 0,
    engagement_rate: 0,
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true)
      const blogsData = await BlogService.getBlogs(filters)
      setBlogs(blogsData)
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const loadStats = useCallback(async () => {
    try {
      const statsData = await BlogService.getBlogStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [])

  useEffect(() => {
    loadBlogs()
    loadStats()
  }, [filters, loadBlogs, loadStats])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      await BlogService.deleteBlog(id)
      await loadBlogs()
      await loadStats()
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedBlogs.length === 0) return

    try {
      switch (action) {
        case 'publish':
          await Promise.all(
            selectedBlogs.map((id) =>
              BlogService.updateBlog({
                id,
                is_published: true,
                published_at: new Date().toISOString(),
              })
            )
          )
          break
        case 'unpublish':
          await Promise.all(
            selectedBlogs.map((id) =>
              BlogService.updateBlog({
                id,
                is_published: false,
              })
            )
          )
          break
        case 'delete':
          if (confirm(`Delete ${selectedBlogs.length} blogs?`)) {
            await Promise.all(
              selectedBlogs.map((id) => BlogService.deleteBlog(id))
            )
          }
          break
      }
      setSelectedBlogs([])
      await loadBlogs()
      await loadStats()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Failed to perform bulk action')
    }
  }

  return (
    <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50/30'>
      {/* Enhanced Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-4'>
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg'>
                <Sparkles className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent'>
                  Content Studio
                </h1>
                <p className='text-gray-600'>
                  Professional content management at scale
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant='outline' className='flex items-center space-x-2'>
                <Download className='w-4 h-4' />
                <span>Export</span>
              </Button>
              <Link href='/superadmin/content/blogs/create'>
                <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'>
                  <Plus className='w-4 h-4 mr-2' />
                  Create Masterpiece
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 py-8 space-y-8'>
        {/* Enhanced Stats Dashboard */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6'>
          <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-100 text-sm font-medium'>
                    Total Posts
                  </p>
                  <p className='text-3xl font-bold mt-2'>{stats.total}</p>
                </div>
                <div className='bg-blue-400/20 p-3 rounded-full'>
                  <Users className='w-6 h-6' />
                </div>
              </div>
              <div className='flex items-center mt-4 text-blue-100 text-sm'>
                <TrendingUp className='w-4 h-4 mr-1' />
                <span>12% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-500 to-green-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-green-100 text-sm font-medium'>
                    Published
                  </p>
                  <p className='text-3xl font-bold mt-2'>{stats.published}</p>
                </div>
                <div className='bg-green-400/20 p-3 rounded-full'>
                  <Eye className='w-6 h-6' />
                </div>
              </div>
              <div className='text-green-100 text-sm mt-4'>
                {Math.round((stats.published / stats.total) * 100)}% of total
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-amber-500 to-amber-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-amber-100 text-sm font-medium'>Drafts</p>
                  <p className='text-3xl font-bold mt-2'>{stats.drafts}</p>
                </div>
                <div className='bg-amber-400/20 p-3 rounded-full'>
                  <Clock className='w-6 h-6' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-500 to-purple-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-purple-100 text-sm font-medium'>
                    Featured
                  </p>
                  <p className='text-3xl font-bold mt-2'>{stats.featured}</p>
                </div>
                <div className='bg-purple-400/20 p-3 rounded-full'>
                  <Zap className='w-6 h-6' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-indigo-100 text-sm font-medium'>
                    Total Views
                  </p>
                  <p className='text-3xl font-bold mt-2'>
                    {(stats.total_views / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className='bg-indigo-400/20 p-3 rounded-full'>
                  <BarChart3 className='w-6 h-6' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-rose-500 to-rose-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-rose-100 text-sm font-medium'>
                    Engagement
                  </p>
                  <p className='text-3xl font-bold mt-2'>
                    {stats.engagement_rate}%
                  </p>
                </div>
                <div className='bg-rose-400/20 p-3 rounded-full'>
                  <TrendingUp className='w-6 h-6' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Controls */}
        <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl'>
          <CardContent className='p-6'>
            <div className='flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between'>
              <div className='flex-1 w-full'>
                <div className='relative max-w-md'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <Input
                    placeholder='Search across titles, content, tags...'
                    value={filters.search || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className='pl-10 border-0 bg-gray-50/50 focus:bg-white transition-all duration-200'
                  />
                </div>
              </div>

              <div className='flex flex-wrap gap-4 items-center'>
                {/* View Mode Toggle */}
                <div className='flex bg-gray-100 rounded-lg p-1'>
                  <button
                    onClick={() => setViewMode('grid')}
                    title='Grid view'
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-current rounded'></div>
                      <div className='w-2 h-2 bg-current rounded'></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm'
                        : 'text-gray-500'
                    }`}
                    title='List view'
                  >
                    <div className='space-y-1'>
                      <div className='w-4 h-1 bg-current rounded'></div>
                      <div className='w-4 h-1 bg-current rounded'></div>
                      <div className='w-4 h-1 bg-current rounded'></div>
                    </div>
                  </button>
                </div>

                {/* Status Filter */}
                <Select
                  value={filters.is_published?.toString() || 'all'}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      is_published:
                        value === 'all' ? undefined : value === 'true',
                    }))
                  }
                >
                  <SelectTrigger className='w-32 bg-gray-50/50 border-0'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='true'>Published</SelectItem>
                    <SelectItem value='false'>Draft</SelectItem>
                  </SelectContent>
                </Select>

                {/* Bulk Actions */}
                {selectedBlogs.length > 0 && (
                  <Select onValueChange={handleBulkAction}>
                    <SelectTrigger className='w-40 bg-blue-50 border-blue-200 text-blue-700'>
                      <SelectValue
                        placeholder={`${selectedBlogs.length} selected`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='publish'>Publish Selected</SelectItem>
                      <SelectItem value='unpublish'>
                        Unpublish Selected
                      </SelectItem>
                      <SelectItem value='delete' className='text-red-600'>
                        Delete Selected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Blogs Grid/List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {loading ? (
            // Enhanced Loading Skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-6'>
                  <div className='space-y-3'>
                    <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    <div className='h-20 bg-gray-200 rounded'></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : blogs.length === 0 ? (
            <Card className='col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 border-0'>
              <CardContent>
                <div className='max-w-md mx-auto'>
                  <div className='w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Sparkles className='w-10 h-10 text-blue-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    No blog posts yet
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Start creating amazing content that will captivate your
                    audience
                  </p>
                  <Link href='/superadmin/content/blogs/create'>
                    <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                      <Plus className='w-4 h-4 mr-2' />
                      Create Your First Masterpiece
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                viewMode={viewMode}
                selected={selectedBlogs.includes(blog.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedBlogs((prev) => [...prev, blog.id])
                  } else {
                    setSelectedBlogs((prev) =>
                      prev.filter((id) => id !== blog.id)
                    )
                  }
                }}
                onEdit={() =>
                  router.push(`/superadmin/content/blogs/edit/${blog.id}`)
                }
                onDelete={() => handleDelete(blog.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Blog Card Component
const BlogCard = ({ blog, viewMode, selected, onSelect, onEdit, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${viewMode === 'list' ? 'flex' : ''}`}
    >
      {/* Selection Checkbox */}
      <div className='absolute top-4 left-4 z-10'>
        <input
          type='checkbox'
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          title='Select blog'
        />
      </div>

      {/* Featured Image */}
      {blog.featured_image_url && (
        <>
          <Image
            src={blog.featured_image_url}
            alt={blog.title}
            fill
            sizes='(max-width: 768px) 100vw, 33vw'
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            style={{ objectFit: 'cover' }}
            priority={true}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Status Badges */}
          <div className='absolute top-4 right-4 flex space-x-2'>
            {blog.is_featured && (
              <Badge className='bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white'>
                <Zap className='w-3 h-3 mr-1' />
                Featured
              </Badge>
            )}
            <Badge
              variant={blog.is_published ? 'default' : 'secondary'}
              className='border-0'
            >
              {blog.is_published ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </>
      )}

      <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className='space-y-4'>
          {/* Title and Excerpt */}
          <div>
            <h3 className='font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
              {blog.title}
            </h3>
            <p className='text-gray-600 text-sm mt-2 line-clamp-3'>
              {blog.excerpt}
            </p>
          </div>

          {/* Metadata */}
          <div className='flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center space-x-4'>
              <span className='flex items-center space-x-1'>
                <Calendar className='w-4 h-4' />
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </span>
              <span className='flex items-center space-x-1'>
                <Clock className='w-4 h-4' />
                <span>{blog.read_time}</span>
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <Eye className='w-4 h-4' />
              <span>{blog.views_count}</span>
            </div>
          </div>

          {/* Category and Tags */}
          <div className='space-y-2'>
            <Badge variant='outline' className='text-blue-600 border-blue-200'>
              {blog.category}
            </Badge>
            {blog.tags && blog.tags.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded'
                  >
                    #{tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className='text-xs text-gray-500'>
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
            <div className='flex items-center space-x-2'>
              <Button variant='ghost' size='sm' onClick={onEdit}>
                <Edit className='w-4 h-4 mr-1' />
                Edit
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:text-gray-700'
              >
                <Eye className='w-4 h-4 mr-1' />
                Preview
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                  <Share2 className='w-4 h-4 mr-2' />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-600' onClick={onDelete}>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
