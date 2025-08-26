# NST Stack

NST Stack is a modern web application boilerplate built with a powerful combination of technologies: **Next.js**, **Supabase**, **Tailwind CSS**, **TanStack Query**, and **Shadcn UI**. It provides a robust foundation for building scalable and maintainable full-stack applications.

## Technologies Used

*   **Next.js**: A React framework for building server-rendered and static web applications. Utilizes the App Router for modern routing and server components.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, real-time subscriptions, and storage.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **TanStack Query (React Query)**: A powerful data-fetching library for React, enabling efficient caching, synchronization, and management of server state.
*   **Shadcn UI**: A collection of re-usable components built with Radix UI and Tailwind CSS, providing beautiful and accessible UI primitives.

## Features

*   **Full-stack Architecture**: Seamless integration of frontend (Next.js, React) and backend (Supabase) for a complete development experience.
*   **Authentication**: Secure user login and session management powered by Supabase Auth.
*   **Database Management**: Efficient data handling with Supabase PostgreSQL, including schema setup and Row Level Security (RLS).
*   **File Storage**: Secure image and file uploads with Supabase Storage, including private access using signed URLs.
*   **Internationalization (i18n)**: Multi-language support with URL-based routing, ensuring a global reach for your application.
*   **Responsive Design**: Built with Tailwind CSS for a mobile-first and adaptive user interface.
*   **Reusable UI Components**: Leverages Shadcn UI for accessible, customizable, and aesthetically pleasing UI elements.
*   **Data Fetching & Caching**: Optimized data fetching and state management with TanStack Query.
*   **End-to-End Testing**: Configured with Playwright for robust UI testing, including authentication flows.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   Bun (package manager)
*   Supabase Project:
    *   Set up a Supabase project.
    *   Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
    *   **Database Setup**: Run the SQL script located at `db/schema.sql` in your Supabase SQL Editor to set up tables, views, functions, and Row Level Security (RLS) policies.

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

## Project Structure

```
.
├── public/                 # Static assets (including /locales for i18n)
├── src/
│   ├── app/                # Next.js App Router pages and layouts (now with /[locale] segment)
│   │   └── [locale]/       # Dynamic locale segment for internationalized routing
│   │       ├── (dashboard)/# Dashboard routes
│   │       │   ├── _components/ # UI components for dashboard (e.g., sidebar)
│   │       │   ├── employees/  # Employee management features (pages, actions, forms, columns)
│   │       │   └── prizes/     # Prize management features (pages, actions, forms, columns)
│   │       ├── login/          # Login page and actions
│   │       ├── actions.ts      # Global server actions
│   │       ├── globals.css     # Global styles
│   │       └── layout.tsx      # Root layout
│   ├── components/         # Reusable UI components (shadcn/ui)
│   │   └── ui/             # Shadcn/ui components
│   ├── lib/                # Utility functions and Supabase client setup
│   │   └── supabase/       # Supabase client configurations
│   └── i18n.ts             # i18next configuration
├── tests/                  # Playwright end-to-end tests
├── .vscode/                # VS Code configurations (e.g., launch.json for debugging)
├── playwright.config.ts    # Playwright test configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── db/                     # Database schema and RLS policies
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── bun.lockb               # Bun lockfile
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For more details on deploying Next.js applications, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).