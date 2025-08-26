'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Import Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import DropdownMenu components

export default function LanguageSwitcher({ size }: { size?: "default" | "sm" | "lg" | "icon" | "fit" }) {
  const router = useRouter();
  const pathname = usePathname(); // Get pathname
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    const currentPath = pathname; // Get current path
    const newPath = `/${lng}${currentPath.substring(currentPath.indexOf('/', 1))}`; // Replace locale segment
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size}> {/* Pass size prop to Button */}
          {i18n.language.split('-')[0].toUpperCase()} {/* Display current language (base language only) */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('th')} disabled={i18n.language === 'th'}>
          ไทย
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
