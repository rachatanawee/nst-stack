import { Menu, CircleUser } from "lucide-react"

import { logout } from "@/app/[locale]/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { MobileSheetNav } from "./mobile-sheet-nav"
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Add this import

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileSheetNav />
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 hidden md:flex items-center justify-center" // Changed md:block to md:flex
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="w-full flex-1 flex justify-start ml-4">
        
      </div>
      <LanguageSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logout}>
            <button
              type="submit"
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
            >
              Logout
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
