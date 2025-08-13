import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/common/icons'

export default function SecurityPage() {
  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-8'>
      <h1 className='text-3xl font-bold text-center mb-4'>Security</h1>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icons.lock className='h-5 w-5 text-red-500' />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Manage your password, two-factor authentication, and account
              security here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
