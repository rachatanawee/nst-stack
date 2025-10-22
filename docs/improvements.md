# NST Stack - สิ่งที่ควรปรับปรุง

## 🔴 Critical Issues (แก้ด่วน)

### 1. ไม่มี Error Boundary
**ปัญหา:** ถ้า component error ทั้งแอปจะ crash

**แก้ไข:**
```typescript
// src/app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// src/app/[locale]/(dashboard)/error.tsx
// เพิ่ม error boundary สำหรับ dashboard
```

### 2. ไม่มี Loading States
**ปัญหา:** ไม่มี loading.tsx ทำให้ user ไม่รู้ว่ากำลังโหลด

**แก้ไข:**
```typescript
// src/app/[locale]/(dashboard)/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}

// src/app/[locale]/(dashboard)/employees/loading.tsx
export default function EmployeesLoading() {
  return <SkeletonTable />
}
```

### 3. Environment Variables ไม่มี Validation
**ปัญหา:** ถ้า env variables ไม่ครบ แอปจะ error แบบไม่ชัดเจน

**แก้ไข:**
```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})
```

### 4. ไม่มี Rate Limiting
**ปัญหา:** Server Actions ไม่มี rate limiting อาจโดน abuse

**แก้ไข:**
```typescript
// src/lib/rate-limit.ts
import { headers } from 'next/headers'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export async function checkRateLimit(limit = 10, window = 60000) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  
  const now = Date.now()
  const record = rateLimit.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + window })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// ใช้ใน Server Actions
export async function createEmployee(formData: FormData) {
  if (!await checkRateLimit()) {
    return { success: false, message: 'Too many requests' }
  }
  // ...
}
```

---

## 🟠 High Priority (ควรแก้เร็ว)

### 5. ไม่มี TypeScript Types จาก Supabase
**ปัญหา:** ไม่มี type safety สำหรับ database queries

**แก้ไข:**
```bash
# Generate types
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```

```typescript
// src/lib/supabase/client.ts
import { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}
```

### 6. ไม่มี Input Validation
**ปัญหา:** Form data ไม่ได้ validate ก่อนส่งไป database

**แก้ไข:**
```typescript
// src/app/[locale]/(dashboard)/employees/schema.ts
import { z } from 'zod'

export const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Required').max(50),
  full_name: z.string().min(1, 'Required').max(255),
  department: z.string().optional(),
  color: z.string().optional(),
})

// ใช้ใน Server Action
export async function createEmployee(formData: FormData) {
  const rawData = {
    employee_id: formData.get('employee_id'),
    full_name: formData.get('full_name'),
    department: formData.get('department'),
    color: formData.get('color'),
  }
  
  const result = employeeSchema.safeParse(rawData)
  
  if (!result.success) {
    return { 
      success: false, 
      message: result.error.errors[0].message 
    }
  }
  
  // Continue with validated data
  const { error } = await supabase.from('employees').insert(result.data)
  // ...
}
```

### 7. ไม่มี Logging & Monitoring
**ปัญหา:** ไม่รู้ว่ามี error เกิดขึ้นใน production

**แก้ไข:**
```typescript
// src/lib/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error)
    // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  },
  info: (message: string, data?: unknown) => {
    console.log(`[INFO] ${message}`, data)
  },
}

// ใช้ใน Server Actions
export async function createEmployee(formData: FormData) {
  try {
    // ...
  } catch (error) {
    logger.error('Failed to create employee', error)
    return { success: false, message: 'An error occurred' }
  }
}
```

### 8. Dashboard Layout เป็น Client Component
**ปัญหา:** layout.tsx ใช้ 'use client' ทำให้ทุก page เป็น client component

**แก้ไข:**
```typescript
// แยก interactive parts ออกมา
// src/app/[locale]/(dashboard)/_components/dashboard-shell.tsx
'use client'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  // ... interactive logic
  return (/* ... */)
}

// src/app/[locale]/(dashboard)/layout.tsx
// ไม่ต้องใช้ 'use client'
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
```

---

## 🟡 Medium Priority (ควรปรับปรุง)

### 9. ไม่มี Unit Tests
**ปัญหา:** มีแค่ E2E tests ไม่มี unit tests

**แก้ไข:**
```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
})
```

### 10. ไม่มี API Documentation
**ปัญหา:** ไม่มีเอกสาร API สำหรับ Server Actions

**แก้ไข:**
```typescript
// เพิ่ม JSDoc comments
/**
 * Create a new employee
 * @param formData - Form data containing employee information
 * @returns Promise with success status and message
 * @example
 * const result = await createEmployee(formData)
 * if (result.success) {
 *   toast.success(result.message)
 * }
 */
export async function createEmployee(formData: FormData) {
  // ...
}
```

### 11. ไม่มี Database Migrations Version Control
**ปัญหา:** SQL files ไม่มี version control ที่ชัดเจน

**แก้ไข:**
```bash
# ใช้ Supabase CLI
supabase init
supabase migration new initial_schema
supabase migration new add_employees_table
```

```
db/migrations/
├── 20240101000000_initial_schema.sql
├── 20240102000000_add_employees_table.sql
└── 20240103000000_add_rls_policies.sql
```

### 12. ไม่มี Optimistic Updates
**ปัญหา:** UI ต้องรอ server response ก่อนอัพเดท

**แก้ไข:**
```typescript
// ใช้ TanStack Query mutations
const mutation = useMutation({
  mutationFn: createEmployee,
  onMutate: async (newEmployee) => {
    await queryClient.cancelQueries({ queryKey: ['employees'] })
    const previous = queryClient.getQueryData(['employees'])
    
    queryClient.setQueryData(['employees'], (old: any[]) => 
      [...old, { ...newEmployee, id: 'temp-id' }]
    )
    
    return { previous }
  },
  onError: (err, newEmployee, context) => {
    queryClient.setQueryData(['employees'], context?.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['employees'] })
  },
})
```

### 13. Hardcoded Supabase URL ใน next.config.ts
**ปัญหา:** Supabase URL hardcoded ใน config

**แก้ไข:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}
```

---

## 🟢 Low Priority (Nice to Have)

### 14. ไม่มี Storybook
**ปัญหา:** ไม่มี component documentation

**แก้ไข:**
```bash
bunx storybook@latest init
```

### 15. ไม่มี Performance Monitoring
**ปัญหา:** ไม่รู้ว่า page ไหนช้า

**แก้ไข:**
```typescript
// src/lib/analytics.ts
export function reportWebVitals(metric: any) {
  console.log(metric)
  // Send to analytics service
}

// src/app/layout.tsx
export { reportWebVitals } from '@/lib/analytics'
```

### 16. ไม่มี Dark Mode Toggle
**ปัญหา:** ใช้ Tailwind dark mode แต่ไม่มีปุ่มสลับ

**แก้ไข:**
```typescript
// src/components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

### 17. ไม่มี Internationalization สำหรับ Error Messages
**ปัญหา:** Error messages เป็นภาษาอังกฤษอย่างเดียว

**แก้ไข:**
```json
// public/locales/th/common.json
{
  "errors": {
    "required": "กรุณากรอกข้อมูล",
    "invalid_email": "อีเมลไม่ถูกต้อง",
    "server_error": "เกิดข้อผิดพลาด"
  }
}
```

### 18. ไม่มี Accessibility Testing
**ปัญหา:** ไม่รู้ว่า accessible หรือไม่

**แก้ไข:**
```bash
bun add -d @axe-core/playwright
```

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/en/employees')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

---

## 📊 Performance Improvements

### 19. ไม่มี Image Optimization
**แก้ไข:**
```typescript
// ใช้ next/image แทน <img>
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority // สำหรับ above-the-fold images
/>
```

### 20. ไม่มี Code Splitting
**แก้ไข:**
```typescript
// Dynamic imports สำหรับ heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // ถ้าไม่ต้องการ SSR
})
```

### 21. ไม่มี Database Indexes
**แก้ไข:**
```sql
-- db/schema.sql
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_created_at ON employees(created_at);
```

---

## 🔒 Security Improvements

### 22. ไม่มี CSRF Protection สำหรับ Forms
**หมายเหตุ:** Next.js Server Actions มี built-in CSRF protection แล้ว แต่ควรเพิ่ม double-check

### 23. ไม่มี Content Security Policy (CSP)
**แก้ไข:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}
```

### 24. ไม่มี Audit Logging
**แก้ไข:**
```sql
-- เพิ่ม audit table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger สำหรับ audit
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📝 Summary

### ลำดับความสำคัญในการแก้

1. **Week 1 (Critical)**
   - Error Boundary
   - Loading States
   - Environment Validation
   - Rate Limiting

2. **Week 2 (High Priority)**
   - TypeScript Types from Supabase
   - Input Validation
   - Logging & Monitoring
   - Fix Dashboard Layout

3. **Week 3 (Medium Priority)**
   - Unit Tests
   - API Documentation
   - Database Migrations
   - Optimistic Updates

4. **Week 4+ (Low Priority)**
   - Storybook
   - Performance Monitoring
   - Dark Mode
   - Accessibility Testing

### Metrics to Track
- [ ] Test Coverage > 80%
- [ ] Lighthouse Score > 90
- [ ] Zero TypeScript errors
- [ ] Zero accessibility violations
- [ ] Response time < 200ms
- [ ] Error rate < 0.1%

---

**หมายเหตุ:** ไม่จำเป็นต้องแก้ทั้งหมดในครั้งเดียว ให้แก้ตามลำดับความสำคัญและ impact ต่อ users
