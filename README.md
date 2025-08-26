# Eventify

Eventify is a web application built with Next.js that helps manage events, employees, and prizes. It leverages Supabase for backend services, including authentication, database management, and file storage.

## Features

*   **Next.js App Router**: Built with the latest Next.js App Router for modern web development.
*   **Supabase Integration**:
    *   **Authentication**: Secure user login and session management.
    *   **Database**: Manages employee and prize data.
    *   **Storage**: Handles image uploads for prizes with secure, private access using signed URLs.
*   **Employee Management**: Full CRUD (Create, Read, Update, Delete) operations for employee records.
*   **Prize Management**: Full CRUD operations for prizes, including image uploads and previews.
*   **Custom Font**: Uses the 'Mitr' font for a localized and distinct visual style.
*   **Dynamic Sidebar Navigation**: Sidebar links dynamically highlight the active route for improved user experience.
*   **End-to-End Testing**: Configured with Playwright for robust UI testing, including login scenarios.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   Bun (package manager)
*   Supabase Project:
    *   Set up a Supabase project.
    *   Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    *   **Database Setup**: Run the SQL script located at `db/schema.sql` in your Supabase SQL Editor to set up tables, views, functions, and Row Level Security (RLS) policies.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd eventify
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (dashboard)/    # Dashboard routes
│   │   │   ├── _components/ # UI components for dashboard (e.g., sidebar)
│   │   │   ├── employees/  # Employee management features (pages, actions, forms, columns)
│   │   │   └── prizes/     # Prize management features (pages, actions, forms, columns)
│   │   ├── login/          # Login page and actions
│   │   ├── actions.ts      # Global server actions
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable UI components (shadcn/ui)
│   │   └── ui/             # Shadcn/ui components
│   └── lib/                # Utility functions and Supabase client setup
│       └── supabase/       # Supabase client configurations
├── tests/                  # Playwright end-to-end tests
├── .vscode/                # VS Code configurations (e.g., launch.json for debugging)
├── playwright.config.ts    # Playwright test configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── db/                     # Database schema and RLS policies
└── package.json            # Project dependencies and scripts
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For more details on deploying Next.js applications, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).