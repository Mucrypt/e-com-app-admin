// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        // REMOVE window.location.reload() to prevent reload loop
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
