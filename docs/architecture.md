# NST Stack Architecture

## System Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        UI[User Interface]
        RC[React Components]
        TQ[TanStack Query Cache]
    end

    subgraph "Next.js App Router"
        SC[Server Components]
        SA[Server Actions]
        API[API Routes]
        MW[Middleware i18n]
    end

    subgraph "Supabase Backend"
        AUTH[Supabase Auth]
        DB[(PostgreSQL + RLS)]
        STORAGE[Storage Buckets]
        RT[Realtime]
    end

    UI --> RC
    RC --> TQ
    TQ --> SC
    RC --> SA
    SC --> AUTH
    SC --> DB
    SA --> AUTH
    SA --> DB
    SA --> STORAGE
    MW --> SC
    
    AUTH -.JWT.-> SC
    AUTH -.JWT.-> SA
    DB -.Row Level Security.-> AUTH

    style UI fill:#3b82f6
    style DB fill:#10b981
    style AUTH fill:#f59e0b
    style TQ fill:#8b5cf6
```

## Application Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Next.js
    participant TanStack Query
    participant Supabase

    User->>Browser: เข้าเว็บ /en/employees
    Browser->>Next.js: Request Page
    Next.js->>Supabase: ตรวจสอบ Auth Session
    Supabase-->>Next.js: Session Valid
    Next.js->>Supabase: Fetch Initial Data (Server Component)
    Supabase-->>Next.js: Return Data
    Next.js-->>Browser: Render HTML + Hydrate
    Browser->>TanStack Query: Cache Data
    
    User->>Browser: คลิก Edit Employee
    Browser->>TanStack Query: Check Cache
    TanStack Query-->>Browser: Return Cached Data
    
    User->>Browser: Submit Form
    Browser->>Next.js: Server Action
    Next.js->>Supabase: Update Database
    Supabase-->>Next.js: Success
    Next.js-->>Browser: Revalidate
    Browser->>TanStack Query: Invalidate & Refetch
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph Frontend
        A[UI Components<br/>Shadcn + Tailwind]
        B[TanStack Query<br/>State Management]
    end

    subgraph Next.js Layer
        C[Server Components<br/>SSR/SSG]
        D[Server Actions<br/>Mutations]
        E[Middleware<br/>i18n Routing]
    end

    subgraph Supabase
        F[Auth Service]
        G[PostgreSQL<br/>with RLS]
        H[Storage<br/>Files/Images]
    end

    A -->|Read| B
    B -->|Fetch| C
    A -->|Write| D
    E -->|Route| C
    C -->|Query| G
    D -->|Mutate| G
    D -->|Upload| H
    F -->|Protect| G
    F -->|Protect| H

    style A fill:#06b6d4
    style B fill:#8b5cf6
    style C fill:#3b82f6
    style D fill:#3b82f6
    style F fill:#f59e0b
    style G fill:#10b981
    style H fill:#10b981
```

## Feature Module Structure

```mermaid
graph TD
    subgraph "Feature: Employees"
        EP[page.tsx<br/>Server Component]
        EA[actions.ts<br/>CRUD Operations]
        EF[form.tsx<br/>Client Component]
        EC[columns.tsx<br/>Table Definition]
    end

    subgraph "Feature: Prizes"
        PP[page.tsx<br/>Server Component]
        PA[actions.ts<br/>CRUD Operations]
        PF[form.tsx<br/>Client Component]
        PC[columns.tsx<br/>Table Definition]
    end

    subgraph "Shared"
        UI[components/ui/<br/>Shadcn Components]
        LIB[lib/supabase/<br/>Client Setup]
    end

    EP --> EA
    EP --> EC
    EF --> EA
    PP --> PA
    PP --> PC
    PF --> PA
    
    EA --> LIB
    PA --> LIB
    EF --> UI
    PF --> UI

    style EP fill:#3b82f6
    style PP fill:#3b82f6
    style UI fill:#06b6d4
    style LIB fill:#10b981
```

## Security Architecture

```mermaid
graph TB
    subgraph "Client Request"
        REQ[HTTP Request]
    end

    subgraph "Next.js Middleware"
        I18N[i18n Routing]
        AUTH_CHECK[Auth Check]
    end

    subgraph "Server Layer"
        SC[Server Component/Action]
        JWT[JWT Validation]
    end

    subgraph "Supabase"
        RLS[Row Level Security]
        DB[(Database)]
        POLICY[RLS Policies]
    end

    REQ --> I18N
    I18N --> AUTH_CHECK
    AUTH_CHECK --> SC
    SC --> JWT
    JWT --> RLS
    RLS --> POLICY
    POLICY --> DB

    style AUTH_CHECK fill:#f59e0b
    style JWT fill:#f59e0b
    style RLS fill:#ef4444
    style POLICY fill:#ef4444
```

## Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        DEV[Local Dev<br/>bun run dev]
    end

    subgraph "CI/CD"
        GIT[Git Push]
        BUILD[Vercel Build]
    end

    subgraph "Production"
        VERCEL[Vercel Edge Network]
        CDN[Static Assets CDN]
    end

    subgraph "Backend"
        SUPABASE[Supabase Cloud<br/>PostgreSQL + Auth + Storage]
    end

    DEV --> GIT
    GIT --> BUILD
    BUILD --> VERCEL
    VERCEL --> CDN
    VERCEL --> SUPABASE

    style VERCEL fill:#000000,color:#ffffff
    style SUPABASE fill:#10b981
```

## Technology Stack Layers

```mermaid
graph TD
    subgraph "Presentation Layer"
        A1[Shadcn UI Components]
        A2[Tailwind CSS]
        A3[React Components]
    end

    subgraph "Application Layer"
        B1[Next.js App Router]
        B2[Server Components]
        B3[Server Actions]
        B4[TanStack Query]
    end

    subgraph "Business Logic Layer"
        C1[CRUD Operations]
        C2[Form Validation]
        C3[File Upload Logic]
    end

    subgraph "Data Layer"
        D1[Supabase Client]
        D2[PostgreSQL Database]
        D3[Supabase Auth]
        D4[Supabase Storage]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B2
    A3 --> B4
    B2 --> C1
    B3 --> C1
    C1 --> D1
    C2 --> D1
    C3 --> D4
    D1 --> D2
    D1 --> D3
    D1 --> D4

    style A1 fill:#06b6d4
    style B1 fill:#3b82f6
    style C1 fill:#8b5cf6
    style D2 fill:#10b981
```
