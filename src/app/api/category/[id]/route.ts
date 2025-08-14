import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch category by id from Supabase
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Category not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}
