import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or create an account',
}

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Toaster position='top-center' />
      {children}
    </div>
  )
}
