import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/common/icons'

export default function SettingsPage() {
  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-8'>
      <h1 className='text-3xl font-bold text-center mb-4'>Account Settings</h1>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icons.settings className='h-5 w-5 text-blue-500' />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Change your name, email, or other personal info here.
            </p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>
              Update your password and security settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
