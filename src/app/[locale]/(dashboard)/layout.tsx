'use client'

import { Header } from "./_components/header"
import { SidebarNav } from "./_components/sidebar-nav"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"

function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 750) // Fake loading time
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <div
      className={`fixed top-20 right-6 z-50 transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="bg-background text-foreground text-xs px-2 py-1 rounded-md border">
        Loading...
      </div>
    </div>
  )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <>
      <LoadingIndicator />
      <div
        className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out ${
          isSidebarCollapsed
            ? "md:grid-cols-[60px_1fr]"
            : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
        }`}
      >
        <SidebarNav isCollapsed={isSidebarCollapsed} />
        <div className="flex flex-col">
          <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  )
}
