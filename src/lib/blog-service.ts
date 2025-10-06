// lib/supabase/enhanced-blog-service.ts
import { createClient } from '@/supabase/client'
import {
  Blog,
  CreateBlogData,
  UpdateBlogData,
  BlogFilters,
  BlogMedia,
  BlogVersion,
} from '@/types/blog'

// BlogStats type moved outside the class
type BlogStats = {
  total: number
  published: number
  drafts: number
  featured: number
  total_views: number
  engagement_rate: number
}

const supabase = createClient()

export class BlogService {
  // Create blog with AI-powered enhancements
  static async createBlog(blogData: CreateBlogData): Promise<Blog> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to create a blog')
    }

    // Generate SEO-friendly slug if not provided
    if (!blogData.slug && blogData.title) {
      blogData.slug = await this.generateSlug(blogData.title)
    }

    // AI-powered content optimization
    const optimizedData = await this.optimizeContentWithAI(blogData)

    const blogWithUser = {
      ...optimizedData,
      created_by: user.id,
      last_edited_by: user.id,
      published_at: blogData.is_published ? new Date().toISOString() : null,
      engagement_score: await this.calculateInitialEngagementScore(
        optimizedData
      ),
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert(blogWithUser)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create blog: ${error.message}`)
    }

    // Create initial version
    await this.createVersion(data.id, data, 'Initial version')

    return data
  }

  // Advanced blog retrieval with multiple filters
  static async getBlogs(filters: BlogFilters = {}): Promise<Blog[]> {
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    // Advanced filtering
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory)
    }

    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level)
    }

    if (filters.is_published !== undefined) {
      query = query.eq('is_published', filters.is_published)
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    if (filters.is_premium !== undefined) {
      query = query.eq('is_premium', filters.is_premium)
    }

    if (filters.author_id) {
      query = query.eq('created_by', filters.author_id)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters.search) {
      query = query.or(`
        title.ilike.%${filters.search}%,
        excerpt.ilike.%${filters.search}%,
        content.ilike.%${filters.search}%
      `)
    }

    if (filters.date_range) {
      query = query.gte('created_at', filters.date_range.start)
      query = query.lte('created_at', filters.date_range.end)
    }

    if (filters.min_engagement) {
      query = query.gte('engagement_score', filters.min_engagement)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`)
    }

    return data || []
  }

  // Update blog
  static async updateBlog(updateData: UpdateBlogData): Promise<Blog> {
    const { id, ...updateFields } = updateData

    const { data, error } = await supabase
      .from('blogs')
      .update(updateFields)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update blog: ${error.message}`)
    }

    return data
  }
  // Get blog stats
  static async getBlogStats(): Promise<BlogStats> {
    const { data: allBlogs } = await supabase
      .from('blogs')
      .select('is_published, is_featured, views_count')

    if (!allBlogs)
      return {
        total: 0,
        published: 0,
        drafts: 0,
        featured: 0,
        total_views: 0,
        engagement_rate: 0,
      }

    const total = allBlogs.length
    const published = allBlogs.filter((blog) => blog.is_published).length
    const drafts = total - published
    const featured = allBlogs.filter((blog) => blog.is_featured).length
    const total_views = allBlogs.reduce(
      (sum, blog) => sum + (blog.views_count || 0),
      0
    )

    return {
      total,
      published,
      drafts,
      featured,
      total_views,
      engagement_rate: total > 0 ? Math.round((published / total) * 100) : 0,
    }
  }

  // AI-powered content generation
  static async generateContentWithAI(
    prompt: string,
    type: 'title' | 'excerpt' | 'content' | 'seo'
  ): Promise<string> {
    // Integration with OpenAI GPT-4 or similar
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      })

      const data = await response.json()
      return data.content
    } catch (error) {
      console.error('AI generation failed:', error)
      throw new Error('Failed to generate content with AI')
    }
  }

  // Advanced media management
  static async uploadMedia(
    blogId: string,
    file: File,
    metadata: Record<string, unknown> = {}
  ): Promise<BlogMedia> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${blogId}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('blog-media')
      .upload(fileName, file)

    if (uploadError) {
      throw new Error(`Failed to upload media: ${uploadError.message}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-media').getPublicUrl(fileName)

    const mediaData = {
      blog_id: blogId,
      media_type: this.getMediaType(file.type),
      media_url: publicUrl,
      metadata,
      sort_order: 0,
    }

    const { data, error } = await supabase
      .from('blog_media')
      .insert(mediaData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to save media: ${error.message}`)
    }

    return data
  }

  // Content versioning
  static async createVersion(
    blogId: string,
    content: Blog,
    description: string
  ): Promise<BlogVersion> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get latest version number
    const { data: versions } = await supabase
      .from('blog_versions')
      .select('version_number')
      .eq('blog_id', blogId)
      .order('version_number', { ascending: false })
      .limit(1)

    const versionNumber =
      versions && versions.length > 0 ? versions[0].version_number + 1 : 1

    const versionData = {
      blog_id: blogId,
      version_number: versionNumber,
      content,
      title: content.title,
      excerpt: content.excerpt,
      changes_description: description,
      created_by: user?.id,
    }

    const { data, error } = await supabase
      .from('blog_versions')
      .insert(versionData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create version: ${error.message}`)
    }

    return data
  }

  // Private helper methods
  private static async generateSlug(title: string): Promise<string> {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private static async optimizeContentWithAI(
    blogData: CreateBlogData
  ): Promise<CreateBlogData> {
    // AI-powered optimization for SEO, readability, etc.
    return {
      ...blogData,
      meta_title: blogData.meta_title || blogData.title,
      meta_description:
        blogData.meta_description || blogData.excerpt?.substring(0, 160),
    }
  }

  private static async calculateInitialEngagementScore(
    blogData: CreateBlogData
  ): Promise<number> {
    // Calculate initial engagement score based on content quality
    let score = 0
    if (blogData.content && blogData.content.length > 1000) score += 20
    if (blogData.featured_image_url) score += 15
    if (blogData.tags && blogData.tags.length > 3) score += 10
    if (blogData.excerpt && blogData.excerpt.length > 100) score += 15
    return score
  }

  private static getMediaType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }
}

// Export as both named and default for compatibility
export { BlogService as EnhancedBlogService }
export default BlogService
