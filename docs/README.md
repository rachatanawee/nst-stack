# NST Stack Documentation

เอกสารประกอบสำหรับ NST Stack Project

## 📄 เอกสารทั้งหมด

### 1. [Architecture Diagram](./architecture.md)
Mermaid diagrams แสดงสถาปัตยกรรมระบบทั้งหมด:
- System Architecture
- Application Flow (Sequence Diagram)
- Data Flow Architecture
- Feature Module Structure
- Security Architecture
- Deployment Architecture
- Technology Stack Layers

### 2. [Developer Guide](./developer-guide.md)
คู่มือสำหรับ Developer ที่ครอบคลุม:
- ภาพรวมสถาปัตยกรรม
- โครงสร้างโปรเจกต์
- Data Flow & State Management
- Authentication & Authorization
- Database & Supabase
- Internationalization (i18n)
- การพัฒนา Feature ใหม่ (Step-by-Step)
- Best Practices
- Testing Strategy
- Deployment
- Troubleshooting

### 3. [Architecture Diagram (SVG)](./architecture-diagram.svg)
รูปภาพสรุป Architecture แบ่งเป็น 3 layers:
- **Client Browser Layer**: UI Components, Tailwind CSS, TanStack Query
- **Next.js App Router Layer**: Server Components, Server Actions, Middleware
- **Supabase Backend Layer**: PostgreSQL, Authentication, Storage, Realtime

### 4. [Data Flow Diagram (SVG)](./data-flow-diagram.svg)
รูปภาพแสดงการไหลของข้อมูลตั้งแต่:
1. User Action
2. Client Component
3. Server Action
4. Supabase Client
5. PostgreSQL + RLS
6. Revalidate Cache
7. TanStack Query
8. UI Update

## 🚀 Quick Start

```bash
# อ่านเอกสารตามลำดับ
1. architecture-diagram.svg     # ดูภาพรวมก่อน
2. data-flow-diagram.svg        # เข้าใจ data flow
3. developer-guide.md           # อ่านคู่มือละเอียด
4. architecture.md              # ดู Mermaid diagrams
```

## 📊 ภาพรวม Technology Stack

```
Frontend:  Next.js 15 + React 19 + TypeScript
Styling:   Tailwind CSS + Shadcn UI
State:     TanStack Query (React Query)
Backend:   Supabase (PostgreSQL + Auth + Storage)
i18n:      react-i18next + URL routing
Testing:   Playwright
Deploy:    Vercel + Supabase Cloud
```

## 🎯 Core Concepts

### Server-First Architecture
- ใช้ Server Components เป็นหลัก
- Client Components เฉพาะที่จำเป็น
- Server Actions แทน API routes

### Type Safety
- TypeScript ทั้งระบบ
- Type-safe database queries
- Type-safe RPC calls

### Security by Default
- Row Level Security (RLS) ทุก table
- JWT-based authentication
- Automatic CSRF protection

### Performance
- Server-side rendering (SSR)
- Automatic code splitting
- Optimistic updates
- Smart caching

## 📖 การใช้งานเอกสาร

### สำหรับ Developer ใหม่
1. เริ่มจาก `architecture-diagram.svg` เพื่อเข้าใจภาพรวม
2. อ่าน `developer-guide.md` ส่วน "ภาพรวมสถาปัตยกรรม"
3. ทำตาม "การพัฒนา Feature ใหม่" step-by-step

### สำหรับ Developer ที่มีประสบการณ์
1. ดู `data-flow-diagram.svg` เพื่อเข้าใจ data flow
2. อ่าน `developer-guide.md` ส่วน "Best Practices"
3. ใช้ `architecture.md` เป็น reference

### สำหรับ Architect/Lead
1. ศึกษา `architecture.md` ทั้งหมด
2. อ่าน `developer-guide.md` ส่วน "Security" และ "Deployment"
3. Review "Technology Stack Layers" diagram

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Tips

- ใช้ VS Code extension "Markdown Preview Mermaid Support" เพื่อดู Mermaid diagrams
- เปิด SVG files ใน browser หรือ VS Code preview
- Bookmark `developer-guide.md` เพื่อใช้เป็น reference
- อัพเดทเอกสารเมื่อมีการเปลี่ยนแปลง architecture

## 📝 Contributing

เมื่อเพิ่ม feature ใหม่:
1. อัพเดท `architecture.md` ถ้ามีการเปลี่ยนแปลง architecture
2. เพิ่ม section ใน `developer-guide.md` ถ้าเป็น pattern ใหม่
3. อัพเดท diagrams ถ้าจำเป็น

---

**Last Updated:** 2024
**Maintained by:** Development Team
