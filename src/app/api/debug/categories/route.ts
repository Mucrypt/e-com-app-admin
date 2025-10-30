import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get all categories to debug
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('❌ Debug: Categories fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error },
        { status: 500 }
      )
    }

    console.log('🔍 Debug: Found categories:', categories?.length)
    categories?.forEach(cat => {
      console.log(`  - ${cat.name} (slug: ${cat.slug}, active: ${cat.is_active})`)
    })

    return NextResponse.json({
      total_categories: categories?.length || 0,
      categories: categories || [],
      message: 'Debug info for categories'
    })
  } catch (error) {
    console.error('❌ Debug: General error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Create sample categories if none exist
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1)

    if (existingCategories && existingCategories.length > 0) {
      return NextResponse.json({
        message: 'Categories already exist',
        count: existingCategories.length
      })
    }

    // Sample categories to create
    const sampleCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        is_active: true,
        is_deleted: false,
        sort_order: 1
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        is_active: true,
        is_deleted: false,
        sort_order: 2
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        is_active: true,
        is_deleted: false,
        sort_order: 3
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        is_active: true,
        is_deleted: false,
        sort_order: 4
      },
      {
        name: 'Luxury',
        slug: 'luxury',
        description: 'Premium and luxury items',
        is_active: true,
        is_deleted: false,
        sort_order: 5
      }
    ]

    const { data: createdCategories, error } = await supabase
      .from('categories')
      .insert(sampleCategories.map(cat => ({
        ...cat,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select()

    if (error) {
      console.error('❌ Error creating sample categories:', error)
      return NextResponse.json(
        { error: 'Failed to create sample categories', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Sample categories created successfully',
      categories: createdCategories,
      count: createdCategories?.length || 0
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}