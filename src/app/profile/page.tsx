'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/common/icons'
import { cn } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, loading } = useAuth()
  interface User {
    email: string
    // Add other user properties if needed
  }
  const [user, setUser] = useState<User | null>(null)
  interface Profile {
    avatar_url?: string
    full_name?: string
    membership_tier?: string
    loyalty_points?: number
    preferences?: {
      currency?: string
      language?: string
      dark_mode?: boolean
      notifications?: boolean
    }
    email_verified?: boolean
    phone?: string
    phone_verified?: boolean
    address?: string
  }
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile')
      const data = await res.json()
      setUser(data.user)
      setProfile(data.profile)
    }
    fetchProfile()
  }, [router])

  // Client-side redirect if not authenticated
  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/Authentication')
    }
  }, [authUser, loading, router])

  const getInitials = (name: string | null) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const membershipTier = profile?.membership_tier || 'Standard'
  const loyaltyPoints = profile?.loyalty_points || 0
  const progressWidth = Math.min(loyaltyPoints, 100)

  // Safely extract preferences as an object
  const prefs =
    profile?.preferences &&
    typeof profile.preferences === 'object' &&
    !Array.isArray(profile.preferences)
      ? (profile.preferences as {
          currency?: string
          language?: string
          dark_mode?: boolean
          notifications?: boolean
        })
      : {}

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        cache: 'no-store', // Important for immediate effect
      })

      // Manually clear cookies in browser for robust logout
      document.cookie = 'sb-access-token=; Max-Age=0; path=/;'
      document.cookie = 'sb-refresh-token=; Max-Age=0; path=/;'
      document.cookie =
        'sb-fanfpoarmlkrwugzbrhl-auth-token=; Max-Age=0; path=/;' // <-- Add this line

      if (response.ok) {
        window.location.replace('/')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Handle error appropriately
    }
  }

  if (loading || !authUser || !user) {
    return <LoadingSpinner message='Loading your profile...' />
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-4'>
      {/* Profile Header */}
      <div className='flex flex-col items-center gap-6 text-center md:flex-row md:text-left w-full max-w-3xl mx-auto'>
        <Avatar className='h-24 w-24 md:h-32 md:w-32'>
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt='Profile picture' />
          ) : null}
          <AvatarFallback className='text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
            {getInitials(profile?.full_name ?? null)}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 space-y-2'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {profile?.full_name || 'Your Profile'}
              </h1>
              <p className='text-muted-foreground'>{user?.email ?? ''}</p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' className='gap-2'>
                <Icons.edit className='h-4 w-4' />
                Edit Profile
              </Button>
              <Button
                variant='destructive'
                className='gap-2'
                onClick={handleLogout}
              >
                <Icons.lock className='h-4 w-4' />
                Logout
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap justify-center md:justify-start gap-2'>
            <Badge variant='premium' className='px-3 py-1 text-sm'>
              {membershipTier} Member
            </Badge>
            <Badge className='px-3 py-1 text-sm gap-1'>
              <Icons.star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
              {loyaltyPoints} Loyalty Points
            </Badge>
            <Badge
              variant={profile?.email_verified ? 'success' : 'warning'}
              className='px-3 py-1 text-sm gap-1'
            >
              <Icons.mail className='h-3.5 w-3.5' />
              {profile?.email_verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className='grid gap-6 md:grid-cols-2 w-full max-w-3xl mx-auto'>
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.user className='h-5 w-5' />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Full Name</p>
                <p className='font-medium'>{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <p className='font-medium'>
                  {profile?.phone || 'Not set'}
                  {profile?.phone_verified && (
                    <Badge variant='success' className='ml-2'>
                      Verified
                    </Badge>
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className='text-sm text-muted-foreground'>Address</p>
              <p className='font-medium'>
                {profile?.address
                  ? JSON.parse(profile.address as string).formatted ||
                    'Address set'
                  : 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Membership Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.gem className='h-5 w-5' />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <p className='font-medium'>{membershipTier}</p>
              </div>
              <Button variant='outline' size='sm'>
                Upgrade
              </Button>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>Loyalty Points</p>
                <p className='font-medium'>{loyaltyPoints}</p>
              </div>
              <div className='h-2 w-full bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className={cn(
                    'h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full',
                    progressWidth >= 100
                      ? 'w-full'
                      : progressWidth >= 75
                      ? 'w-3/4'
                      : progressWidth >= 50
                      ? 'w-1/2'
                      : progressWidth >= 25
                      ? 'w-1/4'
                      : 'w-0'
                  )}
                />
              </div>
              <p className='text-xs text-muted-foreground text-right'>
                {100 - loyaltyPoints} points to next tier
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card - World Class UI */}
        {profile?.preferences && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icons.settings className='h-5 w-5 text-blue-500' />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-blue-50'>
                <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-200 text-blue-700 font-bold'>
                  💵
                </span>
                <span className='font-medium text-blue-700'>Currency:</span>
                <span className='ml-auto text-blue-900'>
                  {prefs.currency ?? 'USD'}
                </span>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-green-50'>
                <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-200 text-green-700 font-bold'>
                  🌐
                </span>
                <span className='font-medium text-green-700'>Language:</span>
                <span className='ml-auto text-green-900'>
                  {prefs.language ?? 'en'}
                </span>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-700 font-bold'>
                  {prefs.dark_mode ? '🌙' : '☀️'}
                </span>
                <span className='font-medium text-gray-700'>Dark Mode:</span>
                <span className='ml-auto text-gray-900'>
                  {prefs.dark_mode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-yellow-50'>
                <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-200 text-yellow-700 font-bold'>
                  🔔
                </span>
                <span className='font-medium text-yellow-700'>
                  Notifications:
                </span>
                <span className='ml-auto text-yellow-900'>
                  {prefs.notifications ? 'On' : 'Off'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.lock className='h-5 w-5' />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Password</p>
                <p className='font-medium'>••••••••</p>
              </div>
              <Button variant='outline' size='sm'>
                Change
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Two-factor Auth</p>
                <p className='font-medium'>Not enabled</p>
              </div>
              <Button variant='outline' size='sm'>
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
