import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with thousand separators (e.g., 1234 -> "1,234")
 */
export function formatNumberWithCommas(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) {
    return String(value)
  }

  return num.toLocaleString('en-US')
}
