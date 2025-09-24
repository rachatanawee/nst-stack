"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Award,
  Bell,
  Home,
  LineChart,
  Package2,
  Users,
  ClipboardList,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useTranslation } from 'react-i18next'; // Add this import
import { useEffect, useState } from "react"
import { getUserInfo } from "../actions"

export const navLinks = [
  { href: "/", label: "dashboard", icon: Home }, // Use translation key
  { href: "/employees", label: "manage_employees", icon: Users }, // Use translation key
  { href: "/registrations", label: "registrations", icon: ClipboardList }, // New link for registrations
  { href: "/prizes", label: "manage_prizes", icon: Award }, // Use translation key
  { href: "/users", label: "manage_users", icon: Users }, // Use translation key
  { href: "/rewards", label: "give_rewards", icon: Award }, // Use translation key
  //{ href: "/reports", label: "reports", icon: LineChart }, // Use translation key
]

export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()
  const { t } = useTranslation('common'); // Add this line, specify namespace
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(
    null
  )

  useEffect(() => {
    async function fetchUserInfo() {
      const info = await getUserInfo()
      if (info) {
        setUserInfo(info)
      }
    }
    fetchUserInfo()
  }, [])

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            {!isCollapsed && <span className="">NST-Stack</span>}
          </Link>
          {!isCollapsed && (
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          )}
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const currentLocale = pathname.split('/')[1]; // Extract locale from pathname
              const localizedHref = `/${currentLocale}${link.href === '/' ? '' : link.href}`; // Prepend locale to href

              const isActive = pathname === localizedHref; // Compare with localized href
              return (
                <Link
                  key={link.href}
                  href={localizedHref} // Use localized href
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {!isCollapsed && t(link.label)} {/* Use t() for translation */}
                </Link>
              )
            })}
          </nav>
        </div>
        {!isCollapsed && userInfo && (
          <div className="mt-auto p-4">
            <div className="text-xs text-muted-foreground">
              <div>{userInfo.email}</div>
              <div>Role: {userInfo.role}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

  
