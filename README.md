# NST Stack

NST Stack is a production-ready web application boilerplate built with **Next.js 15**, **Supabase**, **Tailwind CSS v4**, **TanStack Query**, and **Shadcn UI**. It provides a robust foundation for building scalable and maintainable full-stack applications with built-in security, validation, and monitoring.

## 🚀 What's New

- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Loading States** - Skeleton loaders for better UX
- ✅ **Input Validation** - Zod schemas for type-safe validation
- ✅ **Rate Limiting** - 10 requests/minute per IP
- ✅ **Logging & Monitoring** - Structured logging ready for Sentry
- ✅ **Optimized Layout** - Server Components for better performance

## 🛠️ Tech Stack

### Frontend
*   **Next.js 15.4** - React framework with App Router and Server Components
*   **React 19** - Latest React with improved performance
*   **TypeScript 5** - Type-safe development
*   **Tailwind CSS v4** - Utility-first CSS framework
*   **Shadcn UI** - Beautiful and accessible UI components
*   **TanStack Query** - Powerful data-fetching and caching
*   **Framer Motion** - Smooth animations

### Backend
*   **Supabase** - PostgreSQL database with Row Level Security (RLS)
*   **Supabase Auth** - JWT-based authentication
*   **Supabase Storage** - File storage with signed URLs
*   **Server Actions** - Type-safe RPC calls

### Developer Experience
*   **Bun** - Fast package manager and runtime
*   **Turbopack** - Next-generation bundler
*   **Playwright** - End-to-end testing
*   **ESLint** - Code linting
*   **Zod** - Schema validation

## ✨ Features

### Core Features
*   ✅ **Full-stack Architecture** - Server Components + Server Actions
*   ✅ **Authentication** - Secure JWT-based auth with Supabase
*   ✅ **Database Management** - PostgreSQL with Row Level Security (RLS)
*   ✅ **File Storage** - Secure uploads with signed URLs
*   ✅ **Internationalization (i18n)** - Multi-language support (EN/TH)
*   ✅ **Responsive Design** - Mobile-first with Tailwind CSS
*   ✅ **Real-time Updates** - Live data with Supabase Realtime

### Security & Reliability
*   🛡️ **Input Validation** - Zod schemas on client and server
*   🛡️ **Rate Limiting** - Prevent abuse (10 req/min per IP)
*   🛡️ **Error Boundaries** - Graceful error handling
*   🛡️ **Environment Validation** - Type-safe env variables
*   🛡️ **Row Level Security** - Database-level security

### Developer Experience
*   📊 **Logging & Monitoring** - Structured logs ready for Sentry
*   🎨 **Reusable Components** - Shadcn UI component library
*   ⚡ **Optimized Performance** - Server-first architecture
*   🧪 **End-to-End Testing** - Playwright test suite
*   📝 **Type Safety** - TypeScript throughout

## Getting Started

### Prerequisites

*   **Node.js** v18 or later
*   **Bun** (recommended) or npm/yarn
*   **Supabase Account** - [Sign up here](https://supabase.com)

### Environment Setup

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup

1. Go to your Supabase project
2. Open SQL Editor
3. Run the SQL script from `db/schema.sql`
4. This will create:
   - Tables with Row Level Security (RLS)
   - Views and functions
   - Storage buckets
   - RLS policies

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd nst-stack
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Download Playwright browser binaries:
    ```bash
    bunx playwright install
    ```

### Running the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will automatically redirect to the default locale (e.g., `http://localhost:3000/en`).

### Running Tests

To run end-to-end tests with Playwright:

1.  Ensure the development server is running:
    ```bash
    bun run dev
    ```
2.  In a separate terminal, run the tests:
    ```bash
    bun run test:e2e
    ```

## 📁 Project Structure

```
.
├── docs/                   # 📚 Documentation
│   ├── README.md           # Quick start guide
│   ├── developer-guide.md  # Complete developer guide
│   ├── architecture.md     # Architecture diagrams (Mermaid)
│   ├── architecture.drawio # Editable architecture diagram
│   └── improvements.md     # Improvements checklist
├── public/
│   └── locales/            # 🌍 i18n translations (en, th)
├── src/
│   ├── app/[locale]/       # 🌐 Next.js App Router with i18n
│   │   ├── (dashboard)/    # 📊 Dashboard routes (protected)
│   │   │   ├── _components/# Sidebar, header, shell
│   │   │   ├── employees/  # Employee management
│   │   │   ├── prizes/     # Prize management
│   │   │   ├── rewards/    # Reward distribution
│   │   │   └── error.tsx   # Error boundary
│   │   ├── login/          # 🔐 Login page
│   │   ├── public/         # 🌐 Public pages (no auth)
│   │   └── layout.tsx      # Root layout
│   ├── components/ui/      # 🎨 Shadcn UI components
│   ├── lib/
│   │   ├── supabase/       # Supabase clients (client, server, middleware)
│   │   ├── env.ts          # ✅ Environment validation
│   │   ├── logger.ts       # 📝 Logging utility
│   │   ├── rate-limit.ts   # 🛡️ Rate limiting
│   │   └── utils.ts        # Utility functions
│   └── middleware.ts       # 🔒 Auth + i18n middleware
├── db/                     # 🗄️ Database schema and migrations
├── tests/                  # 🧪 Playwright E2E tests
├── next.config.ts          # ⚙️ Next.js configuration
├── tailwind.config.ts      # 🎨 Tailwind CSS configuration
└── package.json            # 📦 Dependencies
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Quick Start Guide](./docs/README.md)** - Get started quickly
- **[Developer Guide](./docs/developer-guide.md)** - Complete development guide
- **[Architecture Diagrams](./docs/architecture.md)** - System architecture
- **[Improvements Checklist](./docs/improvements.md)** - What's been improved
- **[Logging Guide](./docs/logging-guide.md)** - Logging and monitoring

### Visual Diagrams

- [Architecture Diagram (SVG)](./docs/architecture-diagram.svg)
- [Data Flow Diagram (SVG)](./docs/data-flow-diagram.svg)
- [Architecture (Draw.io)](./docs/architecture.drawio) - Editable
- [Detailed Flow (Draw.io)](./docs/architecture-detail.drawio) - Editable

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables

Make sure to set these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

Contributions are welcome! Please read the [Developer Guide](./docs/developer-guide.md) first.

## 📝 License

MIT License - feel free to use this project for your own applications.

---

**Built with ❤️ using Next.js 15 + Supabase**