import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/api'

export async function GET() {
  const { user, profile } = await getProfile()
  return NextResponse.json({ user, profile })
}
