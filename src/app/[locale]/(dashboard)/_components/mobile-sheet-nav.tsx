import { useState } from "react"; // Import useState
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname
import {
  Menu,
  Package2,
} from "lucide-react" // Only keep Menu and Package2, others will come from navLinks

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils" // Import cn
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { navLinks } from "./sidebar-nav"; // Import navLinks from sidebar-nav

export function MobileSheetNav() {
  const pathname = usePathname()
  const { t } = useTranslation('common'); // Use translation hook
  const [open, setOpen] = useState(false); // State to control sheet open/close

  return (
    <Sheet open={open} onOpenChange={setOpen}> {/* Pass open and onOpenChange */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setOpen(false)} // Close sheet on click
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">NST-Stack</span>
          </Link>
          {navLinks.map((link) => {
            const currentLocale = pathname.split('/')[1]; // Extract locale from pathname
            const localizedHref = `/${currentLocale}${link.href === '/' ? '' : link.href}`; // Prepend locale to href

            const isActive = pathname === localizedHref; // Compare with localized href
            return (
              <Link
                key={link.href}
                href={localizedHref} // Use localized href
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  isActive
                    ? "bg-muted text-foreground" // Use text-foreground for active link
                    : ""
                )}
                onClick={() => setOpen(false)} // Close sheet on click
              >
                <link.icon className="h-5 w-5" />
                {t(link.label)} {/* Use t() for translation */}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}