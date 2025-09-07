'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher({ size }: { size?: "default" | "sm" | "lg" | "icon" }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] || 'en';

  const changeLanguage = (lng: string) => {
    const pathParts = pathname.split('/');
    pathParts[1] = lng;
    const newPath = pathParts.join('/');
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size}>
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={currentLocale === 'en'}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('th')} disabled={currentLocale === 'th'}>
          ไทย
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}