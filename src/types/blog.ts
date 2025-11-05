// Blog types for the content management system

export interface CreateBlogData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string
  category: string
  author_name: string
  author_email: string
  read_time: string
  is_featured: boolean
  is_published: boolean
  meta_title: string
  meta_description: string
  tags: string[]
}

export interface BlogPost extends CreateBlogData {
  id: string
  created_at: string
  updated_at: string
  published_at?: string
  view_count: number
  like_count: number
  comment_count: number
  status: 'draft' | 'published' | 'archived'
  seo_score?: number
  readability_score?: number
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  post_count: number
  created_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  usage_count: number
  created_at: string
}

export interface BlogComment {
  id: string
  blog_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface BlogAnalytics {
  blog_id: string
  views: number
  unique_views: number
  average_read_time: number
  bounce_rate: number
  engagement_rate: number
  social_shares: {
    facebook: number
    twitter: number
    linkedin: number
    email: number
  }
  traffic_sources: {
    direct: number
    search: number
    social: number
    referral: number
  }
  date: string
}

export interface BlogSEOData {
  meta_title: string
  meta_description: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  keywords: string[]
  schema_markup?: object
}

// API Response types
export interface BlogListResponse {
  blogs: BlogPost[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

export interface BlogStatsResponse {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  total_comments: number
  popular_categories: BlogCategory[]
  trending_tags: BlogTag[]
}