'use client'

import React, { useState } from 'react'
import { createClient } from '@/supabase/client'
import { Tables } from '@/supabase/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  FaEdit,
  FaSave,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUserShield,
  FaChartLine,
  FaHistory,
  FaShieldAlt,
  FaKey,
  FaPlus,
} from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'

// Define a more specific type for user preferences
type UserPreferences = {
  theme?: 'light' | 'dark' | 'system'
  notifications?: boolean
  timezone?: string
  bio?: string
  layout?: 'default' | 'compact' | 'detailed'
}

// Define a type for address
type UserAddress = {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

// Extend the Tables<'users'> type with our custom types
type ExtendedUser = Partial<Tables<'users'>> & {
  email?: string
  preferences?: UserPreferences
  address?: UserAddress
  role?: string
  status?: 'active' | 'inactive'
}

export default function AdminProfile() {
  const [user, setUser] = useState<ExtendedUser>({
    full_name: 'Admin Superuser',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'superadmin',
    avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
    address: {
      street: '123 Admin Blvd',
      city: 'Metropolis',
      state: 'CA',
      zip: '90210',
      country: 'United States',
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      timezone: 'America/Los_Angeles',
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const handleInputChange = (
    field: keyof ExtendedUser,
    value: string | UserPreferences | UserAddress
  ) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddressChange = (field: keyof UserAddress, value: string) => {
    setUser((prev) => ({
      ...prev,
      address: {
        ...((prev.address ?? {}) as UserAddress),
        [field]: value,
      },
    }))
  }

  const handlePreferenceChange = (
    field: keyof UserPreferences,
    value: string | boolean
  ) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...((prev.preferences ?? {}) as UserPreferences),
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()
      if (user.id) {
        const { error } = await supabase
          .from('users')
          .update(user)
          .eq('id', user.id)

        if (error) throw error
      }

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          handleInputChange('avatar_url', event.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      toast.success('Profile image updated')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  return (
    <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Profile Card */}
        <div className='lg:col-span-1'>
          <Card className='border-0 shadow-lg rounded-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-indigo-600 to-purple-600 h-24 relative'>
              <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2'>
                <Avatar className='h-32 w-32 border-4 border-white shadow-lg'>
                  <AvatarImage src={user.avatar_url || ''} alt={''} />
                  <AvatarFallback className='bg-indigo-100 text-indigo-800 text-2xl font-bold'>
                    {user.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                  {isEditing && (
                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full'>
                      <Label htmlFor='avatar-upload' className='cursor-pointer'>
                        <FiUpload className='text-white text-2xl' />
                      </Label>
                      <Input
                        id='avatar-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </Avatar>
              </div>
            </div>
            <CardHeader className='pt-20 text-center'>
              <CardTitle className='text-xl font-bold'>
                {user.full_name}
              </CardTitle>
              <CardDescription className='flex justify-center mt-2'>
                <Badge variant='destructive' className='gap-1'>
                  <FaUserShield className='h-3 w-3' />
                  {user.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'>
                    <FaEnvelope className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <p className='font-medium'>{user.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-full bg-green-100 text-green-600'>
                    <FaPhone className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Phone</p>
                    {isEditing ? (
                      <Input
                        value={user.phone || ''}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className='h-8'
                      />
                    ) : (
                      <p className='font-medium'>{user.phone}</p>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-full bg-blue-100 text-blue-600'>
                    <FaGlobe className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Timezone</p>
                    {isEditing ? (
                      <Select
                        value={
                          user.preferences?.timezone || 'America/Los_Angeles'
                        }
                        onValueChange={(value) =>
                          handlePreferenceChange('timezone', value)
                        }
                      >
                        <SelectTrigger className='h-8'>
                          <SelectValue placeholder='Select timezone' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='America/Los_Angeles'>
                            Pacific Time
                          </SelectItem>
                          <SelectItem value='America/New_York'>
                            Eastern Time
                          </SelectItem>
                          <SelectItem value='Europe/London'>London</SelectItem>
                          <SelectItem value='Asia/Tokyo'>Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className='font-medium'>
                        {user.preferences?.timezone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className='mt-6 flex justify-center'>
                {isEditing ? (
                  <Button onClick={handleSave} className='gap-2'>
                    <FaSave className='h-4 w-4' />
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className='gap-2'>
                    <FaEdit className='h-4 w-4' />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className='mt-6 border-0 shadow-lg rounded-xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FaLock className='text-indigo-600' />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Password</p>
                  <p className='text-sm text-gray-500'>
                    Last changed 3 months ago
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Change
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Two-Factor Auth</p>
                  <p className='text-sm text-gray-500'>Not enabled</p>
                </div>
                <Button variant='outline' size='sm'>
                  Enable
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Active Sessions</p>
                  <p className='text-sm text-gray-500'>2 devices</p>
                </div>
                <Button variant='outline' size='sm'>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className='lg:col-span-2'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3 bg-gray-100'>
              <TabsTrigger
                value='profile'
                className='data-[state=active]:bg-white'
              >
                <FaUserShield className='mr-2' />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value='settings'
                className='data-[state=active]:bg-white'
              >
                <FaShieldAlt className='mr-2' />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value='activity'
                className='data-[state=active]:bg-white'
              >
                <FaHistory className='mr-2' />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value='profile' className='mt-6'>
              <Card className='border-0 shadow-lg rounded-xl'>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='full_name'>Full Name</Label>
                      {isEditing ? (
                        <Input
                          id='full_name'
                          value={user.full_name || ''}
                          onChange={(e) =>
                            handleInputChange('full_name', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>{user.full_name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='email'>Email</Label>
                      {isEditing ? (
                        <Input
                          id='email'
                          value={user.email || ''}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                          type='email'
                        />
                      ) : (
                        <p className='font-medium py-2'>{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Bio</Label>
                    {isEditing ? (
                      <Textarea
                        placeholder='Tell us about yourself'
                        value={user.preferences?.bio || ''}
                        onChange={(e) =>
                          handlePreferenceChange('bio', e.target.value)
                        }
                      />
                    ) : (
                      <p className='font-medium py-2'>
                        {user.preferences?.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className='mt-6 border-0 shadow-lg rounded-xl'>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Your primary mailing address
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='street'>Street</Label>
                      {isEditing ? (
                        <Input
                          id='street'
                          value={user.address?.street || ''}
                          onChange={(e) =>
                            handleAddressChange('street', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>
                          {user.address?.street}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='city'>City</Label>
                      {isEditing ? (
                        <Input
                          id='city'
                          value={user.address?.city || ''}
                          onChange={(e) =>
                            handleAddressChange('city', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>{user.address?.city}</p>
                      )}
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='state'>State/Province</Label>
                      {isEditing ? (
                        <Input
                          id='state'
                          value={user.address?.state || ''}
                          onChange={(e) =>
                            handleAddressChange('state', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>
                          {user.address?.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='zip'>ZIP/Postal Code</Label>
                      {isEditing ? (
                        <Input
                          id='zip'
                          value={user.address?.zip || ''}
                          onChange={(e) =>
                            handleAddressChange('zip', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>{user.address?.zip}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='country'>Country</Label>
                      {isEditing ? (
                        <Input
                          id='country'
                          value={user.address?.country || ''}
                          onChange={(e) =>
                            handleAddressChange('country', e.target.value)
                          }
                        />
                      ) : (
                        <p className='font-medium py-2'>
                          {user.address?.country}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value='settings' className='mt-6'>
              <Card className='border-0 shadow-lg rounded-xl'>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your admin experience
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <Label>Theme</Label>
                    <div className='flex gap-4 mt-2'>
                      <div
                        className={`border-2 rounded-lg p-1 cursor-pointer ${
                          user.preferences?.theme === 'light'
                            ? 'border-indigo-600'
                            : 'border-transparent'
                        }`}
                        onClick={() => handlePreferenceChange('theme', 'light')}
                      >
                        <div className='bg-white rounded-md w-24 h-16 flex items-center justify-center'>
                          <span className='text-xs'>Light</span>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-1 cursor-pointer ${
                          user.preferences?.theme === 'dark'
                            ? 'border-indigo-600'
                            : 'border-transparent'
                        }`}
                        onClick={() => handlePreferenceChange('theme', 'dark')}
                      >
                        <div className='bg-gray-900 rounded-md w-24 h-16 flex items-center justify-center text-white'>
                          <span className='text-xs'>Dark</span>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-1 cursor-pointer ${
                          user.preferences?.theme === 'system'
                            ? 'border-indigo-600'
                            : 'border-transparent'
                        }`}
                        onClick={() =>
                          handlePreferenceChange('theme', 'system')
                        }
                      >
                        <div className='bg-gradient-to-r from-white to-gray-900 rounded-md w-24 h-16 flex items-center justify-center'>
                          <span className='text-xs'>System</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label>Notifications</Label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        id='notifications'
                        checked={user.preferences?.notifications || false}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'notifications',
                            e.target.checked
                          )
                        }
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                        title='Receive email notifications'
                      />
                      <Label htmlFor='notifications' className='font-normal'>
                        Receive email notifications
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label>Dashboard Layout</Label>
                    <Select
                      value={user.preferences?.layout || 'default'}
                      onValueChange={(value) =>
                        handlePreferenceChange('layout', value)
                      }
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select layout' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='default'>Default</SelectItem>
                        <SelectItem value='compact'>Compact</SelectItem>
                        <SelectItem value='detailed'>Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className='mt-6 border-0 shadow-lg rounded-xl'>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your integration keys
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <FaKey className='text-indigo-600' />
                        <div>
                          <p className='font-medium'>Production Key</p>
                          <p className='text-sm text-gray-500'>
                            Created 2 months ago
                          </p>
                        </div>
                      </div>
                      <Button variant='outline' size='sm'>
                        Regenerate
                      </Button>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <FaKey className='text-indigo-600' />
                        <div>
                          <p className='font-medium'>Sandbox Key</p>
                          <p className='text-sm text-gray-500'>
                            Created 1 week ago
                          </p>
                        </div>
                      </div>
                      <Button variant='outline' size='sm'>
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <Button className='mt-4' variant='outline'>
                    <FaPlus className='mr-2' />
                    Create New Key
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value='activity' className='mt-6'>
              <Card className='border-0 shadow-lg rounded-xl'>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your actions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    {[
                      {
                        id: 1,
                        action: 'Updated profile information',
                        date: '2023-05-15T14:32:00Z',
                        icon: <FaEdit className='text-indigo-600' />,
                      },
                      {
                        id: 2,
                        action: 'Changed password',
                        date: '2023-05-10T09:15:00Z',
                        icon: <FaLock className='text-green-600' />,
                      },
                      {
                        id: 3,
                        action: 'Viewed sensitive report',
                        date: '2023-05-05T16:45:00Z',
                        icon: <FaChartLine className='text-yellow-600' />,
                      },
                      {
                        id: 4,
                        action: 'Logged in from new device',
                        date: '2023-04-28T11:20:00Z',
                        icon: <FaShieldAlt className='text-blue-600' />,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className='flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0'
                      >
                        <div className='p-2 rounded-full bg-gray-100'>
                          {item.icon}
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium'>{item.action}</p>
                          <p className='text-sm text-gray-500'>
                            {new Date(item.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
