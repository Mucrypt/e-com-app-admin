import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// Add cache headers to reduce redundant requests
const CACHE_HEADERS = {
  'Cache-Control': 'private, max-age=60, s-maxage=60',
  'Vary': 'Authorization',
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { 
          status: 401,
          headers: CACHE_HEADERS
        }
      )
    }

    // Fetch the user profile from the users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { 
          status: 500,
          headers: CACHE_HEADERS
        }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
      },
      profile,
    }, {
      headers: CACHE_HEADERS
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: CACHE_HEADERS
      }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { 
          status: 401,
          headers: CACHE_HEADERS
        }
      )
    }

    const updates: Record<string, any> = await request.json()

    // Validate and sanitize updates
    const allowedFields = [
      'full_name', 
      'username', 
      'avatar_url', 
      'phone', 
      'address',
      'preferences',
      'phone_verified',
      'email_verified'
    ]
    
    const sanitizedUpdates: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        sanitizedUpdates[key] = value
      }
    }

    // Add timestamp
    sanitizedUpdates.updated_at = new Date().toISOString()

    // Update the user profile - using any to bypass strict typing temporarily
    const { data, error } = await (supabase as any)
      .from('users')
      .update(sanitizedUpdates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { 
          status: 500,
          headers: CACHE_HEADERS
        }
      )
    }

    return NextResponse.json(
      { profile: data },
      { headers: CACHE_HEADERS }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: CACHE_HEADERS
      }
    )
  }
}
