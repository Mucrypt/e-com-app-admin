import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export type UserRole = 'user' | 'admin' | 'superadmin'

interface UserRoleData {
  role: UserRole
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  hasAdminAccess: boolean // true for both admin and superadmin
}

export function useUserRole(): UserRoleData {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState<UserRole>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (authLoading) {
        // console.log('Auth still loading, waiting...')
        return
      }

      if (!user) {
        // console.log('No user found, setting role to user')
        setRole('user')
        setLoading(false)
        return
      }

      try {
        // console.log('Fetching role for user:', user.email)
        const response = await fetch('/api/profile')

        if (response.ok) {
          const data = await response.json()
          // console.log('Profile data received:', data)

          // Handle both uppercase and lowercase roles from your database
          const dbRole = data.profile?.role
          if (dbRole) {
            const userRole = dbRole.toLowerCase()
            /*
            console.log(
              'User role from database:',
              dbRole,
              'converted to:',
              userRole
            )
            */

            // Ensure it's a valid role
            if (
              userRole === 'superadmin' ||
              userRole === 'admin' ||
              userRole === 'user'
            ) {
              setRole(userRole as UserRole)
              // console.log('Role set to:', userRole)
            } else {
              // console.log('Invalid role, defaulting to user')
              setRole('user')
            }
          } else {
            // console.log('No role found in profile, defaulting to user')
            setRole('user')
          }
        } else {
          console.error('Failed to fetch profile:', response.status)
          setRole('user')
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole('user')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user, authLoading])

  const isAdmin = role === 'admin'
  const isSuperAdmin = role === 'superadmin'
  const hasAdminAccess = isAdmin || isSuperAdmin

  /*
  console.log('Final role state:', {
    role,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
    loading,
  })
  */

  return {
    role,
    loading,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
  }
}
