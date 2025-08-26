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

import { useTranslation } from 'react-i18next'; // Add this import

const navLinks = [
  { href: "/", label: "dashboard", icon: Home }, // Use translation key
  { href: "/employees", label: "manage_employees", icon: Users }, // Use translation key
  { href: "/prizes", label: "manage_prizes", icon: Award }, // Use translation key
  { href: "/users", label: "manage_users", icon: Users }, // Use translation key
  { href: "/rewards/settings", label: "reward_settings", icon: Award }, // Use translation key
  { href: "/rewards/give", label: "give_rewards", icon: Gift }, // Use translation key
  { href: "/reports", label: "reports", icon: LineChart }, // Use translation key
]

export function SidebarNav() {
  const pathname = usePathname()
  const { t } = useTranslation('common'); // Add this line, specify namespace

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">NST-Stack</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
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
                  {t(link.label)} {/* Use t() for translation */}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

  
