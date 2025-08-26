"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Award,
  Bell,
  Gift,
  Home,
  LineChart,
  Package2,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/employees", label: "จัดการข้อมูลพนักงาน", icon: Users },
  { href: "/prizes", label: "จัดการของรางวัล", icon: Award },
  { href: "/rewards/settings", label: "ตั้งค่ารางวัล", icon: Award },
  { href: "/rewards/give", label: "มอบรางวัล", icon: Gift },
  { href: "/reports", label: "รายงาน", icon: LineChart },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Eventify</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
