import { useEffect, useState } from 'react'


export type Category = {
  id: string
  name: string
  description?: string
  image_url?: string
  icon?: string
  color?: string
  is_active?: boolean
  sort_order?: number
  parent_id?: string | null
  created_at?: string
  updated_at?: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use Supabase REST API directly to avoid type errors
    fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categories?select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { categories, loading, error }
}
