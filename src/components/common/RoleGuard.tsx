import React from 'react'
import { useUserRole, UserRole } from '@/hooks/useUserRole'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function RoleGuard({
  children,
  allowedRoles,
  requireAdmin = false,
  requireSuperAdmin = false,
  fallback = null,
  loading = null,
}: RoleGuardProps) {
  const {
    role,
    loading: roleLoading,
    //isAdmin,
    isSuperAdmin,
    hasAdminAccess,
  } = useUserRole()

  if (roleLoading) {
    return <>{loading}</>
  }

  // Check specific role requirements
  if (requireSuperAdmin && !isSuperAdmin) {
    return <>{fallback}</>
  }

  if (requireAdmin && !hasAdminAccess) {
    return <>{fallback}</>
  }

  // Check allowed roles array
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
