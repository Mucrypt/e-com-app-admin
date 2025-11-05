import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')

    console.log('📋 Fetching scraping jobs with filters:', { page, limit, status, platform })

    // Get real data from database instead of mock data
    const supabase = await createClient()
    
    // Build query with filters
    let query = supabase
      .from('scraping_jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('❌ Error fetching jobs from database:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobs || [],
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('❌ Error fetching scraping jobs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch jobs' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user - require authentication for RLS compliance
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is SUPERADMIN
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || (profile as any).role !== 'SUPERADMIN') {
      return NextResponse.json({ 
        error: 'SUPERADMIN access required' 
      }, { status: 403 })
    }

    const body = await request.json()
    const { action, jobId } = body

    if (action === 'fix_stuck_jobs') {
      // Update stuck processing jobs to failed status
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
      
      const { data: updatedJobs, error: updateError } = await (supabase as any)
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: 'Job automatically marked as failed due to timeout'
        })
        .eq('status', 'processing')
        .lt('created_at', tenMinutesAgo)
        .select()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true,
        message: `Fixed ${updatedJobs?.length || 0} stuck jobs`,
        updatedJobs 
      })
    }

    if (action === 'force_fix_all_stuck_jobs') {
      // Force fix ALL processing jobs regardless of time
      const { data: updatedJobs, error: updateError } = await (supabase as any)
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: 'Job manually marked as failed - was stuck in processing'
        })
        .eq('status', 'processing')
        .select()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true,
        message: `Force-fixed ${updatedJobs?.length || 0} stuck jobs`,
        updatedJobs 
      })
    }

    if (action === 'complete_job' && jobId) {
      // Complete a specific job
      const { data: job, error: jobError } = await supabase
        .from('scraping_jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      const { error: updateJobError } = await (supabase as any)
        .from('scraping_jobs')
        .update({
          status: (job as any).successful_scrapes > 0 ? 'completed' : 'failed',
          processed_urls: (job as any).total_urls,
          completed_at: new Date().toISOString()
        })
        .eq('id', (job as any).id)

      if (updateJobError) {
        return NextResponse.json({ error: updateJobError.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true,
        message: 'Job completed successfully',
        job: job 
      })
    }

    // Auto-fix stuck jobs on every request (background cleanup)
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      await (supabase as any)
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: 'Job automatically timed out'
        })
        .eq('status', 'processing')
        .lt('created_at', fiveMinutesAgo)
    } catch (cleanupError) {
      console.warn('Background cleanup failed:', cleanupError)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Job management error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('job_id')

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'job_id parameter is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user - require authentication for RLS compliance
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is SUPERADMIN
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || (profile as any).role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized - SUPERADMIN access required' }, { status: 403 })
    }

    console.log('🗑️ Deleting scraping job:', jobId)

    // Handle the specific Job #2 UUID issue 
    if (jobId === '2') {
      console.log('❌ Job #2 has UUID format issues - use SQL script in database directly')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Job #2 requires manual deletion via SQL script due to UUID format mismatch. Please run the direct_database_fix.sql script in Supabase SQL Editor.',
          requiresManualFix: true
        },
        { status: 400 }
      )
    }

    // Regular deletion logic for other jobs
    // Handle both UUID and integer IDs
    let deleteQuery = supabase.from('scraping_jobs').delete()
    
    // Try UUID first, then fall back to casting as text for integer IDs
    try {
      const { error: deleteError } = await deleteQuery.eq('id', jobId)
      
      if (deleteError && deleteError.code === '22P02') {
        // Invalid UUID format, try treating as text/integer
        console.log('🔄 Retrying delete with text cast for ID:', jobId)
        const { error: deleteError2 } = await supabase
          .from('scraping_jobs')
          .delete()
          .eq('id::text', jobId)
          
        if (deleteError2) {
          console.error('❌ Error deleting job (second attempt):', deleteError2)
          return NextResponse.json(
            { success: false, error: deleteError2.message },
            { status: 500 }
          )
        }
      } else if (deleteError) {
        console.error('❌ Error deleting job from database:', deleteError)
        return NextResponse.json(
          { success: false, error: deleteError.message },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('❌ Unexpected error during delete:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete job' },
        { status: 500 }
      )
    }

    console.log('✅ Successfully deleted scraping job:', jobId)

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error deleting job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete job' 
      },
      { status: 500 }
    )
  }
}