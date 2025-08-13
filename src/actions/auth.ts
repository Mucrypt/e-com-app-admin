'use server'

import { createClient } from '@/supabase/server'

export const authenticate = async (email: string, password: string) => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
}

export const signUp = async (email: string, password: string) => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)
}

export const signInWithGoogle = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)
}
/*
export const getLatestUsers = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) throw new Error(`Error fetching latest users: ${error.message}`)

  return data.map(
    (user: { id: string; email: string; created_at: string | null }) => ({
      id: user.id,
      email: user.email,
      date: user.created_at,
    })
  )
}
  */
