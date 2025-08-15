import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch product by id from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Product not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}
