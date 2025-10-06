'use server'

import { createClient } from '@/supabase/server'

/**
 * Authenticates a user using their email and password.
 *
 * This function creates a Supabase client and attempts to sign in the user
 * with the provided credentials. If authentication fails, it throws an error
 * with the relevant message.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @throws {Error} If authentication fails, an error is thrown with the failure message.
 */
export const authenticate = async (email: string, password: string) => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
}

/**
 * Registers a new user with the provided email and password using Supabase authentication.
 *
 * @param email - The user's email address to sign up with.
 * @param password - The user's password to sign up with.
 * @throws Will throw an error if the sign-up process fails.
 */
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

/**
 * Initiates the sign-in process using Google OAuth via Supabase authentication.
 *
 * This function creates a Supabase client instance and triggers the OAuth sign-in flow
 * with Google as the provider. Upon successful authentication, the user will be redirected
 * to the specified callback URL.
 *
 * @throws {Error} Throws an error if the sign-in process fails.
 *
 * @example
 * try {
 *   await signInWithGoogle();
 * } catch (error) {
 *  console.error('Error during Google sign-in:', error);
 * }
 */
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
