'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { showAuthToast } from '@/components/ui/auth-toast'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        showAuthToast('success', 'Successfully authenticated!')
        router.push('/')
      } else {
        showAuthToast('error', 'Authentication failed. Please try again.')
        router.push('/Authentication')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='animate-pulse text-lg font-medium'>Authenticating...</div>
    </div>
  )
}
