'use client'

import React, { useEffect, useState } from 'react'
import { Tables } from '@/supabase/types'
import {
  FaSearch,
  FaFilter,
  FaSync,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
  FaEllipsisV,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import UserForm from './UserForm'
import { createClient } from '@/supabase/client'

type User = Tables<'users'> & {
  // Type for inserting a user (id optional, status not included)
  role?: string | null
  status?: 'active' | 'inactive'
}

type SortConfig = {
  key: keyof User
  direction: 'ascending' | 'descending'
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    direction: 'descending',
  })
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const filterAndSortUsers = React.useCallback(() => {
    let result = [...users]

    // Apply search filter
    if (debouncedSearchTerm) {
      result = result.filter(
        (user) =>
          user.full_name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (user.phone as string | undefined)
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      )
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      result = result.filter((user) => user.role === selectedRole)
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter((user) => user.status === selectedStatus)
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })

    setFilteredUsers(result)
  }, [debouncedSearchTerm, users, selectedRole, selectedStatus, sortConfig])

  useEffect(() => {
    filterAndSortUsers()
  }, [filterAndSortUsers])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      let data = await res.json()
      // Normalize role and status for frontend
      data = Array.isArray(data)
        ? data.map((user) => ({
            ...user,
            role:
              typeof user.role === 'string'
                ? user.role.toLowerCase()
                : user.role,
            status: user.status || 'active',
          }))
        : []
      setUsers(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error')
      }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return <FaSort className='ml-1 opacity-30' />
    return sortConfig.direction === 'ascending' ? (
      <FaSortUp className='ml-1' />
    ) : (
      <FaSortDown className='ml-1' />
    )
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('users').delete().eq('id', userId)

      if (error) throw error

      setUsers(users.filter((user) => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'

    try {
      // In a real app, you would update this in your database
      // This is just a simulation
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      )
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleFormSubmit = async (userData: Partial<User>) => {
    try {
      const supabase = createClient()

      if (editingUser) {
        // Update existing user
        const updateData = {
          ...userData,
          role: userData.role ?? 'admin',
        }
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', editingUser.id)
          .select()
          .single()

        if (error) throw error

        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? { ...data, role: data.role ?? 'admin', status: u.status }
              : u
          )
        )
        window.alert('User updated successfully')
      } else {
        // Create new user
        // Only send allowed fields (do not include status, let id be auto-generated)
        const {
          address,
          avatar_url,
          created_at,
          email_verified,
          full_name,
          loyalty_points,
          membership_tier,
          phone,
          phone_verified,
          preferences,
          updated_at,
          role,
        } = userData
        const insertData = {
          id: crypto.randomUUID(), // Generate a UUID for id if not provided by Supabase
          address,
          avatar_url,
          created_at,
          email_verified,
          full_name,
          loyalty_points,
          membership_tier,
          phone,
          phone_verified,
          preferences,
          updated_at,
          role: typeof role === 'string' ? role : 'admin',
        }

        const { data, error } = await supabase
          .from('users')
          .insert(insertData)
          .select()
          .single()

        if (error) throw error

        setUsers([
          { ...data, role: data.role ?? 'admin', status: 'active' },
          ...users,
        ])
        window.alert('User created successfully')
      }

      setIsFormOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      window.alert('Failed to save user')
    }
  }

  return (
    <div className='container mx-auto p-4 md:p-6'>
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-2xl font-bold'>Admin Users</CardTitle>
          <Button
            onClick={() => {
              setEditingUser(null)
              setIsFormOpen(true)
            }}
          >
            <FaUserPlus className='mr-2' />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <FaSearch className='absolute left-3 top-3 text-gray-400' />
              <Input
                placeholder='Search users...'
                className='pl-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    <FaFilter className='mr-2' />
                    Role: {selectedRole === 'all' ? 'All' : selectedRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedRole('all')}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedRole('superadmin')}
                  >
                    Super Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole('admin')}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole('editor')}>
                    Editor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    <FaFilter className='mr-2' />
                    Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus('inactive')}
                  >
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant='outline' onClick={fetchUsers}>
                <FaSync className='mr-2' />
                Refresh
              </Button>
            </div>
          </div>

          {loading && <div>Loading users...</div>}
          {error && <div className='text-red-500 mb-2'>{error}</div>}
          {!loading && !error && (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>User</TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => requestSort('full_name')}
                    >
                      <div className='flex items-center'>
                        Name
                        {getSortIcon('full_name')}
                      </div>
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => requestSort('role')}
                    >
                      <div className='flex items-center'>
                        Role
                        {getSortIcon('role')}
                      </div>
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => requestSort('created_at')}
                    >
                      <div className='flex items-center'>
                        Joined
                        {getSortIcon('created_at')}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center py-8'>
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage
                              src={user.avatar_url ?? ''}
                              alt='avatar'
                            />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {user.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'superadmin'
                                ? 'destructive'
                                : user.role === 'admin'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active' ? 'default' : 'outline'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <FaEllipsisV className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => handleEdit(user)}
                              >
                                <FaEdit className='mr-2' />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleStatus(user)}
                              >
                                {user.status === 'active' ? (
                                  <>
                                    <FaBan className='mr-2' />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <FaCheck className='mr-2' />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(user.id)}
                                className='text-red-600'
                              >
                                <FaTrash className='mr-2' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={editingUser ?? undefined}
        onSubmit={(values) => handleFormSubmit(values)}
      />

      <Toaster />
    </div>
  )
}
