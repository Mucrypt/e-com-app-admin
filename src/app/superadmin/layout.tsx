import SuperAdminSidebar from '@/components/superAdmin/SuperAdminSidebar'
import SuperAdminTopbar from '@/components/superAdmin/SuperAdminTopbar'
import { Toaster } from '@/components/ui/sonner'


export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
       
            <SuperAdminSidebar />
            <div className='flex-1 flex flex-col'>
              <SuperAdminTopbar />
              <main className='flex-1 p-0 m-0'>{children}</main>
              <Toaster position='top-center' richColors />
            </div>
         
    </div>
  )
}
