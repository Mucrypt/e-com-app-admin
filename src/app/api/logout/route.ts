import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  await supabase.auth.signOut()

  // Create response and clear cookies
  const response = NextResponse.json({ success: true })

  // Clear all auth cookies
  response.cookies.set({
    name: 'sb-access-token',
    value: '',
    expires: new Date(0),
    path: '/',
  })
  response.cookies.set({
    name: 'sb-refresh-token',
    value: '',
    expires: new Date(0),
    path: '/',
  })

  return response
}
