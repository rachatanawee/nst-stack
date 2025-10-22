# NST Stack - Developer Guide

## สารบัญ
1. [ภาพรวมสถาปัตยกรรม](#ภาพรวมสถาปัตยกรรม)
2. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
3. [Data Flow & State Management](#data-flow--state-management)
4. [Authentication & Authorization](#authentication--authorization)
5. [Database & Supabase](#database--supabase)
6. [Internationalization (i18n)](#internationalization-i18n)
7. [การพัฒนา Feature ใหม่](#การพัฒนา-feature-ใหม่)
8. [Best Practices](#best-practices)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)

---

## ภาพรวมสถาปัตยกรรม

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Shadcn UI   │  │  Tailwind    │  │   TanStack   │  │
│  │  Components  │  │     CSS      │  │    Query     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Next.js Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Server     │  │   Server     │  │  Middleware  │  │
│  │  Components  │  │   Actions    │  │   (i18n +    │  │
│  │   (SSR)      │  │  (Mutations) │  │    Auth)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  Supabase Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Auth JWT   │  │   Storage    │  │
│  │   + RLS      │  │   Sessions   │  │   Buckets    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Server-First Architecture**: ใช้ Server Components เป็นหลัก, Client Components เฉพาะที่จำเป็น
2. **Type Safety**: TypeScript ทั้งระบบ
3. **Security by Default**: Row Level Security (RLS) ทุก table
4. **Progressive Enhancement**: ทำงานได้แม้ JavaScript ปิด (ส่วนใหญ่)
5. **Performance**: Optimistic updates, caching, และ prefetching

---

## โครงสร้างโปรเจกต์

### Directory Structure

```
src/
├── app/[locale]/              # Next.js App Router (i18n)
│   ├── (dashboard)/           # Route Group (shared layout)
│   │   ├── _components/       # Dashboard-specific components
│   │   │   └── sidebar.tsx    # Navigation sidebar
│   │   ├── employees/         # Employee feature
│   │   │   ├── page.tsx       # Server Component (initial render)
│   │   │   ├── actions.ts     # Server Actions (CRUD)
│   │   │   ├── form.tsx       # Client Component (form)
│   │   │   ├── columns.tsx    # Table column definitions
│   │   │   └── employees-client-wrapper.tsx
│   │   ├── prizes/            # Prize feature
│   │   ├── layout.tsx         # Dashboard layout
│   │   └── page.tsx           # Dashboard home
│   ├── login/                 # Login feature
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── public/                # Public pages (no auth)
│   ├── actions.ts             # Global server actions
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
│
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── data-table.tsx         # Reusable data table
│   ├── ClientProvider.tsx     # TanStack Query provider
│   └── LanguageSwitcher.tsx   # i18n switcher
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   ├── middleware.ts      # Middleware client
│   │   └── actions.ts         # Supabase utilities
│   ├── utils.ts               # Utility functions (cn, etc.)
│   └── i18n.server.ts         # i18n server utilities
│
├── i18n.ts                    # i18n configuration
└── middleware.ts              # Next.js middleware (auth + i18n)
```

### File Naming Conventions

- `page.tsx` - Route page (Server Component)
- `layout.tsx` - Layout wrapper
- `actions.ts` - Server Actions
- `form.tsx` - Client Component with form
- `columns.tsx` - Table column definitions
- `*-client-wrapper.tsx` - Client wrapper for Server Components

---

## Data Flow & State Management

### 1. Server Components (Initial Load)

```typescript
// src/app/[locale]/(dashboard)/employees/page.tsx
export default async function EmployeesPage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  
  // Fetch data on server
  const { data: employees } = await supabase
    .from("employees")
    .select()
  
  // Pass to client component
  return <EmployeesClientWrapper employees={employees ?? []} />
}
```

**ข้อดี:**
- SEO-friendly (HTML มีข้อมูลตั้งแต่แรก)
- Fast initial load
- ไม่ต้องส่ง JavaScript สำหรับ data fetching

### 2. Server Actions (Mutations)

```typescript
// src/app/[locale]/(dashboard)/employees/actions.ts
"use server"

export async function createEmployee(formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  
  const data = {
    employee_id: formData.get("employee_id") as string,
    full_name: formData.get("full_name") as string,
    // ...
  }
  
  const { error } = await supabase.from("employees").insert(data)
  
  if (error) {
    return { success: false, message: error.message }
  }
  
  revalidatePath("/employees") // Refresh cache
  return { success: true }
}
```

**ข้อดี:**
- Type-safe RPC calls
- Automatic serialization
- ไม่ต้องสร้าง API routes
- Built-in CSRF protection

### 3. TanStack Query (Client-side Caching)

```typescript
// Client Component
const { data, isLoading } = useQuery({
  queryKey: ['employees'],
  queryFn: async () => {
    const supabase = createClient()
    const { data } = await supabase.from('employees').select()
    return data
  }
})

// Mutation with optimistic update
const mutation = useMutation({
  mutationFn: async (formData: FormData) => {
    return await createEmployee(formData)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['employees'] })
  }
})
```

**ข้อดี:**
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

### Data Flow Diagram

```
User Action
    ↓
Client Component (form.tsx)
    ↓
Server Action (actions.ts)
    ↓
Supabase Client (server.ts)
    ↓
PostgreSQL + RLS
    ↓
revalidatePath() → Clear Next.js cache
    ↓
TanStack Query invalidate → Refetch
    ↓
UI Update
```

---

## Authentication & Authorization

### 1. Middleware Layer

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const {supabase, response} = createClient(request)
  
  // Refresh session
  const { data: { session } } = await supabase.auth.getSession()
  
  const isLoggedIn = !!session
  const isLoginPage = pathname.endsWith('/login')
  const isPublicPage = pathname.includes('/public')
  
  // Redirect logic
  if (isPublicPage) return response
  if (isLoggedIn && isLoginPage) return redirect('/')
  if (!isLoggedIn && !isLoginPage) return redirect('/login')
  
  return response
}
```

**หน้าที่:**
- ตรวจสอบ session ทุก request
- Redirect ตาม auth state
- Refresh expired tokens
- จัดการ i18n routing

### 2. Supabase Client Types

#### Browser Client (`lib/supabase/client.ts`)
```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}
```
**ใช้เมื่อ:** Client Components, TanStack Query

#### Server Client (`lib/supabase/server.ts`)
```typescript
export const createClient = async (
  cookieStorePromise: ReturnType<typeof cookies>,
  useServiceRole = false
) => {
  const cookieStore = await cookieStorePromise
  const supabaseKey = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  
  return createServerClient(/* ... */)
}
```
**ใช้เมื่อ:** Server Components, Server Actions

#### Middleware Client (`lib/supabase/middleware.ts`)
```typescript
export function createClient(request: NextRequest) {
  // Special client for middleware
}
```
**ใช้เมื่อ:** Middleware only

### 3. Row Level Security (RLS)

```sql
-- Example RLS Policy
CREATE POLICY "Users can view their own data"
ON employees
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything"
ON employees
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

**Best Practices:**
- ทุก table ต้องมี RLS enabled
- ใช้ `auth.uid()` เพื่อเช็ค user
- แยก policy ตาม operation (SELECT, INSERT, UPDATE, DELETE)
- Test policies ด้วย different users

---

## Database & Supabase

### Database Schema Pattern

```sql
-- Standard table structure
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Auto-update timestamp
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Supabase Features Used

#### 1. Database
- PostgreSQL 15+
- Row Level Security (RLS)
- Triggers & Functions
- Views for complex queries

#### 2. Authentication
- JWT-based sessions
- Email/Password auth
- Session refresh in middleware
- Secure cookie storage

#### 3. Storage
- File uploads (images, documents)
- Private buckets with RLS
- Signed URLs for temporary access
- Automatic image optimization

#### 4. Realtime (Optional)
```typescript
// Subscribe to changes
const channel = supabase
  .channel('employees')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'employees' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### Database Migrations

```bash
# Create migration
supabase migration new add_new_column

# Apply migration
supabase db push

# Reset database (dev only)
supabase db reset
```

---

## Internationalization (i18n)

### URL-based Routing

```
/en/employees  → English
/th/employees  → Thai
```

### Implementation

#### 1. Middleware Routing
```typescript
// src/middleware.ts
const defaultLocale = 'en'
const locales = ['en', 'th']

// Redirect if locale missing
if (pathnameIsMissingLocale) {
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
```

#### 2. Translation Files
```json
// public/locales/en/common.json
{
  "welcome": "Welcome",
  "employees": "Employees"
}

// public/locales/th/common.json
{
  "welcome": "ยินดีต้อนรับ",
  "employees": "พนักงาน"
}
```

#### 3. Usage in Components
```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('welcome')}</h1>
}
```

#### 4. Language Switcher
```typescript
// components/LanguageSwitcher.tsx
const router = useRouter()
const pathname = usePathname()

const switchLanguage = (locale: string) => {
  const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`)
  router.push(newPath)
}
```

---

## การพัฒนา Feature ใหม่

### Step-by-Step Guide

#### 1. สร้าง Database Schema

```sql
-- db/schema.sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
ON products FOR SELECT
USING (true);
```

#### 2. สร้าง Feature Folder

```
src/app/[locale]/(dashboard)/products/
├── page.tsx              # Server Component
├── actions.ts            # Server Actions
├── form.tsx              # Client Component
├── columns.tsx           # Table columns
└── products-client-wrapper.tsx
```

#### 3. Server Component (page.tsx)

```typescript
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function ProductsPage() {
  const supabase = await createClient(cookies())
  const { data: products } = await supabase
    .from("products")
    .select()
  
  return <ProductsClientWrapper products={products ?? []} />
}
```

#### 4. Server Actions (actions.ts)

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function createProduct(formData: FormData) {
  const supabase = await createClient(cookies())
  
  const { error } = await supabase
    .from("products")
    .insert({
      name: formData.get("name"),
      price: formData.get("price")
    })
  
  if (error) {
    return { success: false, message: error.message }
  }
  
  revalidatePath("/products")
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  // Similar pattern
}

export async function deleteProduct(id: string) {
  // Similar pattern
}
```

#### 5. Client Wrapper

```typescript
"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { ProductForm } from "./form"

export function ProductsClientWrapper({ products }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Product</Button>
      <DataTable columns={columns} data={products} />
      <ProductForm open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
```

#### 6. Form Component

```typescript
"use client"

import { useForm } from "react-hook-form"
import { createProduct } from "./actions"
import { toast } from "sonner"

export function ProductForm({ open, onOpenChange }) {
  const form = useForm()
  
  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    const result = await createProduct(formData)
    
    if (result.success) {
      toast.success("Product created!")
      onOpenChange(false)
      form.reset()
    } else {
      toast.error(result.message)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Dialog>
  )
}
```

#### 7. Table Columns

```typescript
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(price)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />
  }
]
```

#### 8. เพิ่ม Navigation

```typescript
// src/app/[locale]/(dashboard)/_components/sidebar.tsx
const menuItems = [
  { href: "/employees", label: "Employees" },
  { href: "/prizes", label: "Prizes" },
  { href: "/products", label: "Products" }, // ← เพิ่มใหม่
]
```

---

## Best Practices

### 1. Component Organization

```typescript
// ❌ Bad: Everything in one file
export default function Page() {
  // 500 lines of code
}

// ✅ Good: Separated concerns
// page.tsx - Server Component (data fetching)
// client-wrapper.tsx - Client Component (interactivity)
// form.tsx - Form logic
// columns.tsx - Table configuration
// actions.ts - Server Actions
```

### 2. Server vs Client Components

```typescript
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData() // Can use async/await
  return <div>{data}</div>
}

// ✅ Client Component (when needed)
"use client"
export function InteractiveForm() {
  const [state, setState] = useState() // Can use hooks
  return <form>...</form>
}
```

**ใช้ Client Components เมื่อ:**
- ต้องใช้ React hooks (useState, useEffect, etc.)
- ต้องการ event handlers (onClick, onChange)
- ต้องการ browser APIs (localStorage, window)
- ต้องการ third-party libraries ที่ใช้ hooks

### 3. Error Handling

```typescript
// Server Action
export async function createItem(formData: FormData) {
  try {
    const { error } = await supabase.from("items").insert(data)
    
    if (error) {
      console.error("Supabase error:", error)
      return { success: false, message: error.message }
    }
    
    revalidatePath("/items")
    return { success: true, message: "Created successfully" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Client Component
const onSubmit = async (data) => {
  const result = await createItem(formData)
  
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}
```

### 4. Type Safety

```typescript
// Define types
type Employee = {
  id: string
  employee_id: string
  full_name: string
  department: string
}

// Use in components
export function EmployeeList({ employees }: { employees: Employee[] }) {
  // TypeScript will catch errors
}

// Generate types from Supabase
// supabase gen types typescript --project-id <id> > types/supabase.ts
```

### 5. Performance Optimization

```typescript
// ✅ Parallel data fetching
const [employees, prizes] = await Promise.all([
  supabase.from("employees").select(),
  supabase.from("prizes").select()
])

// ✅ Selective revalidation
revalidatePath("/employees") // Only revalidate specific path

// ✅ Optimistic updates
const mutation = useMutation({
  mutationFn: updateEmployee,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['employees'] })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['employees'])
    
    // Optimistically update
    queryClient.setQueryData(['employees'], (old) => [...old, newData])
    
    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['employees'], context.previous)
  }
})
```

### 6. Security Checklist

- [ ] RLS enabled บน table ทั้งหมด
- [ ] ไม่มี sensitive data ใน client-side code
- [ ] ใช้ Service Role Key เฉพาะ server-side
- [ ] Validate input ทั้ง client และ server
- [ ] ใช้ HTTPS ใน production
- [ ] Environment variables ไม่ commit ลง git
- [ ] Test RLS policies ด้วย different users

---

## Testing Strategy

### 1. End-to-End Testing (Playwright)

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/en/login')
  
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/en/')
})

test('user can create employee', async ({ page }) => {
  // Login first
  await page.goto('/en/employees')
  await page.click('text=Add Employee')
  
  await page.fill('input[name="employee_id"]', 'EMP001')
  await page.fill('input[name="full_name"]', 'John Doe')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('text=John Doe')).toBeVisible()
})
```

### 2. Running Tests

```bash
# Run all tests
bun run test:e2e

# Run specific test
bunx playwright test tests/login.spec.ts

# Debug mode
bunx playwright test --debug

# UI mode
bunx playwright test --ui
```

### 3. Test Best Practices

- ใช้ `data-testid` สำหรับ selectors ที่สำคัญ
- แยก test data จาก production data
- Clean up data หลัง test
- ใช้ fixtures สำหรับ common setup
- Test critical user flows

---

## Deployment

### Vercel Deployment

#### 1. Environment Variables

```bash
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx (Server-side only)
```

#### 2. Build Settings

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

#### 3. Deployment Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Supabase Setup

#### 1. Create Project
- ไปที่ https://supabase.com
- สร้าง project ใหม่
- เก็บ URL และ API keys

#### 2. Run Migrations

```bash
# ใน Supabase SQL Editor
-- Copy & paste จาก db/schema.sql
-- Run ทีละ section
```

#### 3. Configure Storage

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false);

-- RLS policy for storage
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Post-Deployment Checklist

- [ ] Environment variables ตั้งครบ
- [ ] Database migrations รันแล้ว
- [ ] RLS policies ใช้งานได้
- [ ] Storage buckets สร้างแล้ว
- [ ] Test login flow
- [ ] Test CRUD operations
- [ ] Check error monitoring
- [ ] Verify i18n routing

---

## Troubleshooting

### Common Issues

#### 1. "Session not found" Error

```typescript
// ✅ Solution: Refresh session in middleware
const { data: { session } } = await supabase.auth.getSession()
```

#### 2. RLS Policy Blocking Query

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'employees';

-- Temporarily disable for testing (dev only!)
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
```

#### 3. Middleware Redirect Loop

```typescript
// ✅ Check for infinite redirects
if (isPublicPage) return response // Exit early
```

#### 4. TanStack Query Not Updating

```typescript
// ✅ Invalidate queries after mutation
queryClient.invalidateQueries({ queryKey: ['employees'] })

// ✅ Or use revalidatePath in Server Action
revalidatePath('/employees')
```

#### 5. i18n Not Working

```typescript
// ✅ Check middleware matcher
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Supabase Studio](https://supabase.com/dashboard) - Database management
- [Vercel Dashboard](https://vercel.com/dashboard) - Deployment
- [Playwright Inspector](https://playwright.dev/docs/debug) - Test debugging

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)

---

## คำแนะนำสุดท้าย

1. **อ่าน Error Messages**: Error messages ใน Next.js และ Supabase ละเอียดมาก
2. **ใช้ TypeScript**: จะช่วยจับ bugs ก่อน runtime
3. **Test บ่อยๆ**: อย่ารอจนเขียนเสร็จถึงค่อย test
4. **Follow Conventions**: ใช้ naming patterns ที่มีอยู่
5. **Security First**: คิดเรื่อง security ตั้งแต่เริ่มต้น
6. **Performance Matters**: ใช้ Server Components เท่าที่ทำได้
7. **Document Your Code**: เขียน comments สำหรับ logic ที่ซับซ้อน

Happy Coding! 🚀
