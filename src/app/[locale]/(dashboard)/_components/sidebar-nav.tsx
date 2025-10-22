/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Award,
  Home,
  Users,
  ClipboardList,
  Monitor,
  Trophy,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { useTranslation } from 'react-i18next'; // Add this import
import { useEffect, useState } from "react"
import { getUserInfo } from "../actions"

export const navLinks = [
  { href: "/", label: "dashboard", icon: Home },
  { href: "/employees", label: "manage_employees", icon: Users },
  { href: "/registrations", label: "registrations", icon: ClipboardList },
  { href: "/prizes", label: "manage_prizes", icon: Award },
  { href: "/users", label: "manage_users", icon: Users },
  { href: "/rewards", label: "give_rewards", icon: Award },
  { href: "/public/dashboard?session=day", label: "realtime_dashboard", icon: Monitor, external: true },
  { href: "/public/winners?session=day", label: "winners_day", icon: Trophy, external: true },
  { href: "/public/winners?session=night", label: "winners_night", icon: Trophy, external: true },
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
            
            {!isCollapsed && (
              <img
                src="/HOYA_logo.png"
                alt="HOYA Logo"
                className="h-8 w-auto"
              />
            )}
          </Link>

        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const currentLocale = pathname.split('/')[1];
              const localizedHref = `/${currentLocale}${link.href === '/' ? '' : link.href}`;
              const isActive = pathname === localizedHref;
              
              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <link.icon className="h-4 w-4" />
                  {!isCollapsed && t(link.label)}
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
