import { useEffect, useState } from 'react'

export type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category_id?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
  stock?: number
  sku?: string
  color?: string
  size?: string
  brand?: string
  meta_title?: string
  meta_description?: string
  seo_keywords?: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { products, loading, error }
}
