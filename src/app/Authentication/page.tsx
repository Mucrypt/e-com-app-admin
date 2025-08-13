'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { authenticate, signUp, signInWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showAuthToast } from '@/components/ui/auth-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Schema definitions
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

const signupSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type AuthMode = 'login' | 'signup'

export default function AuthenticationPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const router = useRouter()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    setIsSubmitting(true)
    try {
      await authenticate(data.email, data.password)
      router.push('/dashboard')
    } catch {
      showAuthToast('error', 'Login failed: Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignUp(data: z.infer<typeof signupSchema>) {
    setIsSubmitting(true)
    try {
      await signUp(data.email, data.password)
      router.push('/dashboard')
    } catch {
      showAuthToast('error', 'Sign up failed: Email already in use')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true)
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch {
      showAuthToast('error', 'Google sign in failed: Please try again later')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='shadow-lg'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-gray-800'>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {mode === 'login'
                ? 'Log in to access your account'
                : 'Join us today to get started'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              onClick={handleGoogleSignIn}
              variant='outline'
              className='w-full gap-2'
              disabled={isSubmitting}
            >
              {/* ...existing code... */}
            </Button>

            <div className='my-6 flex items-center'>
              <Separator className='flex-1' />
              <span className='mx-4 text-sm text-gray-500'>or</span>
              <Separator className='flex-1' />
            </div>

            {mode === 'login' ? (
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className='space-y-4'
                >
                  <FormField
                    control={loginForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' autoComplete='email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type={showLoginPassword ? 'text' : 'password'}
                              autoComplete='current-password'
                              {...field}
                            />
                            <button
                              type='button'
                              tabIndex={-1}
                              className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700'
                              onClick={() => setShowLoginPassword((v) => !v)}
                              aria-label={
                                showLoginPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showLoginPassword ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.125-6.175M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 3l18 18'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : null}
                    Log In
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(handleSignUp)}
                  className='space-y-4'
                >
                  <FormField
                    control={signupForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' autoComplete='email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type={showSignupPassword ? 'text' : 'password'}
                              autoComplete='new-password'
                              {...field}
                            />
                            <button
                              type='button'
                              tabIndex={-1}
                              className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700'
                              onClick={() => setShowSignupPassword((v) => !v)}
                              aria-label={
                                showSignupPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showSignupPassword ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.125-6.175M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 3l18 18'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type={showSignupConfirm ? 'text' : 'password'}
                              autoComplete='new-password'
                              {...field}
                            />
                            <button
                              type='button'
                              tabIndex={-1}
                              className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700'
                              onClick={() => setShowSignupConfirm((v) => !v)}
                              aria-label={
                                showSignupConfirm
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showSignupConfirm ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.125-6.175M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 3l18 18'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : null}
                    Sign Up
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className='flex justify-center'>
            <p className='text-sm text-gray-600'>
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
              <button
                type='button'
                onClick={toggleMode}
                className='ml-1 font-medium text-blue-600 hover:underline'
                disabled={isSubmitting}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
