import { Suspense } from 'react'
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import LoginContent to ensure it's a client component
const LoginContent = dynamic(() => import('./LoginContent'));

export default async function LoginPage({ searchParams: searchParamsPromise, params: paramsPromise }: { searchParams: Promise<{ message: string | undefined }>, params: Promise<{ locale: string }> }) { // Make LoginPage async and accept searchParams and params as Promises
  const searchParams = await searchParamsPromise; // Await searchParams
  const params = await paramsPromise; // Await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent message={searchParams.message ?? null} locale={params.locale} /> {/* Pass locale as prop */}
    </Suspense>
  )
}