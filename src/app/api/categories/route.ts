import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

/**
 * HTTP GET handler for fetching categories from Supabase.
 *
 * Query parameters:
 * - "limit" (string) — maximum number of categories to return; defaults to "12".
 * - "parent_only" (string) — when set to "true", returns only top-level categories (parent_id IS NULL).
 * - "active" (string) — when set to "true", returns only active categories.
 * - "with_count" (string) — when set to "true", includes product count for each category.
 *
 * Behavior:
 * - Creates a Supabase client and queries the "categories" table.
 * - Filters based on query parameters.
 * - Orders results by sort_order (ascending) then by name (ascending) and applies the numeric limit.
 * - Optionally includes product count for each category.
 * - Returns a JSON response containing the array of categories.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '12'
    const parentOnly = searchParams.get('parent_only') === 'true'
    const activeOnly = searchParams.get('active') === 'true'
    const withCount = searchParams.get('with_count') === 'true'

    const supabase = await createClient()

    let query = supabase.from('categories').select('*')

    // Filter for active categories only
    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    // Always exclude deleted categories
    query = query.eq('is_deleted', false)

    // Filter for parent categories only (main categories)
    if (parentOnly) {
      query = query.is('parent_id', null)
    }

    // Order by sort_order, then by name
    query = query
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true })

    // Apply limit
    if (limit !== 'all') {
      query = query.limit(parseInt(limit))
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // Optionally get product count for each category
    if (withCount) {
      const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true)
            .eq('is_deleted', false)

          return {
            ...category,
            product_count: count || 0,
          }
        })
      )

      return NextResponse.json(categoriesWithCount)
    }

    return NextResponse.json(categories || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * HTTP POST handler for creating new categories.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin or superadmin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = profile?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const categoryData = await request.json()

    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryData.slug)
      .eq('is_deleted', false)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    // Create the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: categoryData.is_active ?? true,
        is_deleted: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Category creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
