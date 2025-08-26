"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from 'react'

import { login } from './actions'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTranslation } from 'react-i18next'; // Add this import
import LanguageSwitcher from '@/components/LanguageSwitcher'; // Import LanguageSwitcher

function LoginContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const { t } = useTranslation('common'); // Add this line, specify namespace

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen relative"> {/* Add relative here */}
      <div className="absolute top-4 right-4 z-50"> {/* Position LanguageSwitcher */}
        <LanguageSwitcher size="sm" /> {/* Add LanguageSwitcher here with size prop */}
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          CSI Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This dashboard has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t('login_heading')}</h1> {/* Translate heading */}
            <p className="text-balance text-muted-foreground">
              {t('login_description')} {/* Translate description */}
            </p>
          </div>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email_label')}</Label> {/* Translate label */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('password_label')}</Label> {/* Translate label */}
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    {t('forgot_password')} {/* Translate text */}
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button formAction={login} type="submit" className="w-full">
                {t('login_button')} {/* Translate button text */}
              </Button>
            </div>
          </form>
  
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
