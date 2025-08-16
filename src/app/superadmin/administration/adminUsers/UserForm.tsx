'use client'

import React from 'react'
import { Tables } from '@/supabase/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FaUser, FaPhone, FaShieldAlt, FaCheck } from 'react-icons/fa'

const userSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['superadmin', 'admin', 'editor']),
  avatar_url: z.string().optional(),
})

type UserFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: Tables<'users'>
  onSubmit: (values: Partial<Tables<'users'>>) => void
}

export default function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormProps) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      role: (user?.role as 'superadmin' | 'admin' | 'editor') || 'admin',
      avatar_url: user?.avatar_url || '',
    },
  })

  const handleSubmit = (values: z.infer<typeof userSchema>) => {
    onSubmit({
      ...values,
      id: user?.id,
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <FaUser className='text-gray-500' />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Enter full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <FaPhone className='text-gray-500' />
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <FaShieldAlt className='text-gray-500' />
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='superadmin'>Super Admin</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='editor'>Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='avatar_url'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter avatar URL' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                type='button'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>
                <FaCheck className='mr-2' />
                {user ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
