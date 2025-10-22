'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ERROR] Application error:', error)
    // TODO: Send to error tracking service (Sentry, etc.)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เกิดข้อผิดพลาด</CardTitle>
          <CardDescription>
            ขออภัย เกิดข้อผิดพลาดในการทำงาน
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
          </p>
          <Button onClick={reset} className="w-full">
            ลองอีกครั้ง
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
