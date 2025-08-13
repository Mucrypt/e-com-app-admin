import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileNav from '@/components/layout/profile-nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your account and preferences',
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await (await supabase).auth.getUser()

  if (!user) {
    redirect('/Authentication')
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col'>
      {/* Main content container - properly centered */}
      <div className='flex-1 w-full flex flex-col items-center'>
        <div className='w-full max-w-4xl px-2 sm:px-4 lg:px-6'>
          <div className='flex flex-col items-center space-y-6 py-8 w-full'>
            <ProfileNav />
            <div className='w-full'>{children}</div>
          </div>
        </div>
      </div>

      {/* Full-width footer */}
      <Footer />
    </div>
  )
}
