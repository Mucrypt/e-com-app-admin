// app/superadmin/content/blogs/page.tsx - REVOLUTIONARY VERSION
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Blog, BlogFilters, BlogAnalytics } from '@/types/blog'
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
  Clock,
  Users,
  Search,
  BarChart3,
  TrendingUp,
  Share2,
  MoreVertical,
  Sparkles,
  Grid3X3,
  List,
  Star,
  Target,
  Rocket,
  Crown,
  Globe,
  Brain,
  Palette,
  Workflow,
  Bot,
  Zap, // Changed from Lightning to Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// AI Content Generator Component
const AIContentGenerator = ({
  onContentGenerated,
}: {
  onContentGenerated: (content: string) => void
}) => {
  const [generating, setGenerating] = useState(false)
  const [topic, setTopic] = useState('')

  const generateContent = async () => {
    setGenerating(true)
    try {
      // Simulate AI content generation
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const generatedContent = `<h2>AI-Generated Content About ${topic}</h2><p>This is revolutionary AI-powered content that will captivate your audience and drive engagement.</p>`
      onContentGenerated(generatedContent)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
        >
          <Brain className='w-4 h-4 mr-2' />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Brain className='w-6 h-6 text-purple-500' />
            AI Content Generator
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='Enter topic or keywords...'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className='text-lg p-4'
          />
          <Button
            onClick={generateContent}
            disabled={!topic || generating}
            className='w-full bg-gradient-to-r from-purple-600 to-pink-600'
          >
            {generating ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                Generating Revolutionary Content...
              </>
            ) : (
              <>
                <Zap className='w-4 h-4 mr-2' />
                Generate Masterpiece
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BlogsListPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({})
  const [analytics, setAnalytics] = useState<BlogAnalytics>({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0,
    total_views: 0,
    engagement_rate: 0,
    top_performers: [],
    trending_topics: [],
    reader_demographics: {},
    performance_metrics: {},
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid')
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

  const loadAnalytics = useCallback(async () => {
    try {
      const analyticsData = await BlogService.getBlogAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }, [])

  useEffect(() => {
    loadBlogs()
    loadAnalytics()
  }, [filters, loadBlogs, loadAnalytics])

  const handleContentGenerated = (content: string) => {
    // Navigate to create page with pre-filled content
    router.push(
      `/superadmin/content/blogs/create?content=${encodeURIComponent(content)}`
    )
  }

  // Add handleDelete function
  const handleDelete = async (blogId: string) => {
    try {
      setLoading(true)
      await BlogService.deleteBlog(blogId)
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='overflow-y-auto max-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30'>
      {/* Revolutionary Header */}
      <div className='bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50'>
        <div className='px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-6'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse'></div>
                <div className='relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-2xl'>
                  <Rocket className='w-8 h-8 text-white' />
                </div>
              </div>
              <div>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent animate-gradient'>
                  Content Universe
                </h1>
                <p className='text-gray-600 text-lg mt-1'>
                  Next-Generation Content Management Platform
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <AIContentGenerator onContentGenerated={handleContentGenerated} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='border-2 border-dashed border-gray-300 hover:border-blue-500'
                  >
                    <Workflow className='w-4 h-4 mr-2' />
                    Templates
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-64'>
                  <DropdownMenuItem>
                    <Palette className='w-4 h-4 mr-2' />
                    Marketing Campaign
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Target className='w-4 h-4 mr-2' />
                    Product Launch
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className='w-4 h-4 mr-2' />
                    Viral Content
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href='/superadmin/content/blogs/create'>
                <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group'>
                  <div className='relative'>
                    <Plus className='w-5 h-5 mr-2 group-hover:rotate-90 transition-transform' />
                    <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt'></div>
                  </div>
                  Create Epic Content
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='px-8 py-8 space-y-8'>
        {/* AI-Powered Insights Dashboard */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <Card className='lg:col-span-4 bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-2xl border-0'>
            <CardContent className='p-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold mb-2 flex items-center gap-3'>
                    <Brain className='w-6 h-6 text-purple-400' />
                    AI Content Intelligence
                  </h2>
                  <p className='text-blue-200'>
                    Real-time insights and recommendations powered by advanced
                    AI
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-green-400'>98%</div>
                    <div className='text-blue-300 text-sm'>
                      Engagement Score
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    className='border-white/20 text-white hover:bg-white/10'
                  >
                    <Bot className='w-4 h-4 mr-2' />
                    Optimize All
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                <div className='bg-white/10 rounded-xl p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-blue-200 font-medium'>
                      Top Performing
                    </span>
                    <Crown className='w-4 h-4 text-yellow-400' />
                  </div>
                  <div className='space-y-2'>
                    {analytics.top_performers
                      ?.slice(0, 2)
                      .map((post: Blog, index: number) => (
                        <div
                          key={index}
                          className='flex items-center justify-between text-sm'
                        >
                          <span className='text-white truncate'>
                            {post.title}
                          </span>
                          <span className='text-green-400 font-bold'>
                            {post.views || 0} views
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className='bg-white/10 rounded-xl p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-blue-200 font-medium'>
                      Trending Topics
                    </span>
                    <TrendingUp className='w-4 h-4 text-green-400' />
                  </div>
                  <div className='space-y-2'>
                    {analytics.trending_topics
                      ?.slice(0, 3)
                      .map((topic: string, index: number) => (
                        <div
                          key={index}
                          className='text-white text-sm flex items-center gap-2'
                        >
                          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                          {topic}
                        </div>
                      ))}
                  </div>
                </div>

                <div className='bg-white/10 rounded-xl p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-blue-200 font-medium'>
                      AI Recommendations
                    </span>
                    <Sparkles className='w-4 h-4 text-purple-400' />
                  </div>
                  <div className='space-y-2'>
                    <div className='text-white text-sm'>
                      • Optimize meta descriptions
                    </div>
                    <div className='text-white text-sm'>
                      • Add more visual content
                    </div>
                    <div className='text-white text-sm'>
                      • Update older posts
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats with Animations */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          {[
            {
              label: 'Total Universe',
              value: analytics.total,
              icon: Globe,
              color: 'from-blue-500 to-cyan-500',
              trend: '+12%',
            },
            {
              label: 'Published Stars',
              value: analytics.published,
              icon: Eye,
              color: 'from-green-500 to-emerald-500',
              trend: '+8%',
            },
            {
              label: 'Draft Nebulas',
              value: analytics.drafts,
              icon: Clock,
              color: 'from-amber-500 to-orange-500',
              trend: '+5%',
            },
            {
              label: 'Featured Galaxies',
              value: analytics.featured,
              icon: Star,
              color: 'from-purple-500 to-pink-500',
              trend: '+15%',
            },
            {
              label: 'Cosmic Views',
              value: (analytics.total_views / 1000).toFixed(1) + 'K',
              icon: Users,
              color: 'from-indigo-500 to-blue-500',
              trend: '+23%',
            },
            {
              label: 'Engagement Rate',
              value: analytics.engagement_rate + '%',
              icon: TrendingUp,
              color: 'from-rose-500 to-red-500',
              trend: '+7%',
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300 group overflow-hidden`}
            >
              <CardContent className='p-6 relative'>
                <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500'></div>
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <stat.icon className='w-8 h-8 text-white/80' />
                    <div className='flex items-center text-white/80 text-sm'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      {stat.trend}
                    </div>
                  </div>
                  <p className='text-white/80 text-sm font-medium mb-2'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-bold'>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revolutionary Content Grid */}
        <div className='space-y-6'>
          {/* Enhanced Controls */}
          <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-2xl'>
            <CardContent className='p-6'>
              <div className='flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between'>
                <div className='flex-1 w-full'>
                  <div className='relative max-w-2xl'>
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <Input
                      placeholder='Search across multiverse of content, AI insights, performance metrics...'
                      value={filters.search || ''}
                      onChange={(e) =>
                        setFilters((prev: BlogFilters) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className='pl-12 pr-4 py-3 text-lg border-0 bg-gray-50/50 focus:bg-white shadow-inner focus:shadow-lg transition-all duration-300 rounded-2xl'
                    />
                  </div>
                </div>

                <div className='flex flex-wrap gap-4 items-center'>
                  {/* View Mode Toggle */}
                  <div className='flex bg-gray-100 rounded-2xl p-1 shadow-inner'>
                    {[
                      { mode: 'grid', icon: Grid3X3, label: 'Cosmic Grid' },
                      { mode: 'list', icon: List, label: 'Timeline View' },
                      {
                        mode: 'kanban',
                        icon: Workflow,
                        label: 'Workflow Board',
                      },
                    ].map(({ mode, icon: Icon, label }) => (
                      <TooltipProvider key={mode}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                setViewMode(mode as 'grid' | 'list' | 'kanban')
                              }
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                viewMode === mode
                                  ? 'bg-white shadow-lg text-blue-600'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title={label}
                              aria-label={label}
                            >
                              <Icon className='w-5 h-5' />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  {/* AI Filter Assistant */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='border-2 border-dashed border-purple-200 text-purple-600 hover:border-purple-300'
                      >
                        <Brain className='w-4 h-4 mr-2' />
                        AI Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>AI-Powered Content Discovery</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <Input placeholder="Describe what you're looking for..." />
                        <Button className='w-full bg-gradient-to-r from-purple-600 to-pink-600'>
                          <Sparkles className='w-4 h-4 mr-2' />
                          Discover Content
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revolutionary Content Display */}
          {viewMode === 'kanban' ? (
            <KanbanView blogs={blogs} />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'
                  : 'space-y-4'
              }
            >
              {loading ? (
                // Enhanced Loading Skeleton with AI Animation
                Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className='animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 border-0'
                  >
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        <div className='h-6 bg-gray-300 rounded-lg w-3/4'></div>
                        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                        <div className='h-32 bg-gray-300 rounded-xl'></div>
                        <div className='flex gap-2'>
                          <div className='h-6 bg-gray-300 rounded-full w-16'></div>
                          <div className='h-6 bg-gray-300 rounded-full w-20'></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : blogs.length === 0 ? (
                <Card className='col-span-full text-center py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-0 shadow-2xl'>
                  <CardContent>
                    <div className='max-w-2xl mx-auto'>
                      <div className='w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-8 relative'>
                        <Rocket className='w-16 h-16 text-blue-600' />
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full animate-ping opacity-20'></div>
                      </div>
                      <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                        Launch Your First Cosmic Content
                      </h3>
                      <p className='text-gray-600 text-lg mb-8'>
                        Begin your journey to create content that will
                        revolutionize your industry and captivate audiences
                        worldwide
                      </p>
                      <div className='flex gap-4 justify-center'>
                        <AIContentGenerator
                          onContentGenerated={handleContentGenerated}
                        />
                        <Link href='/superadmin/content/blogs/create'>
                          <Button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl px-8 py-3 text-lg'>
                            <Rocket className='w-5 h-5 mr-2' />
                            Create Masterpiece
                          </Button>
                        </Link>
                      </div>
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
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Blog Card Component
type BlogCardProps = {
  blog: Blog
  viewMode: 'grid' | 'list' | 'kanban'
  selected: boolean
  onSelect: (selected: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

const BlogCard = ({
  blog,
  viewMode,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: BlogCardProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 border-0 
      ${selected ? 'ring-4 ring-blue-500 ring-offset-4' : 'shadow-2xl'}
      ${viewMode === 'list' ? 'flex min-h-[200px]' : 'h-full'}
      bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm`}
    >
      {/* Selection Checkbox */}
      <div className='absolute top-4 left-4 z-20'>
        <div
          className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 cursor-pointer
          ${
            selected
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white/80 border-gray-300 group-hover:border-blue-300'
          }`}
          onClick={() => onSelect(!selected)}
        >
          {selected && (
            <div className='w-full h-full flex items-center justify-center text-white'>
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Performance Badge */}
      {(blog.performance_score || 0) > 80 && (
        <div className='absolute top-4 right-4 z-20'>
          <Badge className='bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg'>
            <TrendingUp className='w-3 h-3 mr-1' />
            Top Performer
          </Badge>
        </div>
      )}

      <CardContent
        className={`p-6 ${
          viewMode === 'list' ? 'flex-1 flex flex-col' : 'h-full flex flex-col'
        }`}
      >
        <div className='flex-1 space-y-4'>
          {/* Title and Excerpt */}
          <div>
            <h3 className='font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 mb-3'>
              {blog.title}
            </h3>
            <p className='text-gray-600 text-sm leading-relaxed line-clamp-3'>
              {blog.excerpt}
            </p>
          </div>

          {/* AI Performance Metrics */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between text-xs text-gray-500'>
              <span>Engagement Score</span>
              <span className='font-bold text-green-600'>
                {blog.engagement_score || 75}%
              </span>
            </div>
            <Progress value={blog.engagement_score || 75} className='h-2' />

            <div className='flex items-center justify-between text-xs text-gray-500'>
              <span>Read Completion</span>
              <span className='font-bold text-blue-600'>
                {blog.read_completion || 68}%
              </span>
            </div>
            <Progress value={blog.read_completion || 68} className='h-2' />
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onEdit}
                className='hover:bg-blue-50 hover:text-blue-600 transition-colors'
              >
                <Edit className='w-4 h-4 mr-1' />
                Edit
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                onClick={() => setShowAnalytics(true)}
              >
                <BarChart3 className='w-4 h-4 mr-1' />
                Analytics
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='hover:bg-gray-50'>
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem>
                  <Share2 className='w-4 h-4 mr-2' />
                  Share Across Platforms
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Rocket className='w-4 h-4 mr-2' />
                  Boost Performance
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Target className='w-4 h-4 mr-2' />
                  A/B Test
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-600' onClick={onDelete}>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>

      {/* Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <BarChart3 className='w-6 h-6 text-blue-600' />
              Performance Analytics
            </DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h4 className='font-semibold'>Engagement Metrics</h4>
              {/* Add detailed analytics here */}
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold'>AI Recommendations</h4>
              {/* Add AI insights here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Kanban View Component
const KanbanView = ({ blogs }: { blogs: Blog[] }) => {
  const columns = [
    { id: 'draft', title: 'Draft Nebulas', color: 'bg-amber-500' },
    { id: 'review', title: 'Review Orbit', color: 'bg-blue-500' },
    { id: 'scheduled', title: 'Scheduled Launch', color: 'bg-purple-500' },
    { id: 'published', title: 'Live Universe', color: 'bg-green-500' },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {columns.map((column) => (
        <div key={column.id} className='space-y-4'>
          <div className='flex items-center gap-2 p-4 bg-white rounded-2xl shadow-lg'>
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <h3 className='font-bold text-gray-900'>{column.title}</h3>
            <span className='ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm'>
              {blogs.filter((blog: Blog) => blog.status === column.id).length}
            </span>
          </div>
          <div className='space-y-4'>
            {blogs
              .filter((blog: Blog) => blog.status === column.id)
              .map((blog: Blog) => (
                <div
                  key={blog.id}
                  className='bg-white p-4 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300'
                >
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    {blog.title}
                  </h4>
                  <p className='text-gray-600 text-sm line-clamp-2'>
                    {blog.excerpt}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
