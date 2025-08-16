
import { createClient } from '@/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('API /api/users: Starting GET')
  const supabase = await createClient()
  console.log('API /api/users: Supabase client created')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    console.log('API /api/users: Query result', { data, error })
    if (error) {
      console.error('API /api/users: Supabase error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('API /api/users: Unexpected error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
