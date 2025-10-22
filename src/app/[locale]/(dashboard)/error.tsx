'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <Card>
      <CardHeader>
        <CardTitle>เกิดข้อผิดพลาด</CardTitle>
        <CardDescription>
          ไม่สามารถโหลดข้อมูลได้
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
        </p>
        <Button onClick={reset}>
          ลองอีกครั้ง
        </Button>
      </CardContent>
    </Card>
  )
}
