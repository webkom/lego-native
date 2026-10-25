import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCursor(url?: string | null): string | null {
  if (!url) return null;

  try {
    return new URL(url).searchParams.get('cursor');
  } catch {
    // Fallback in case `next` is a relative URL or raw cursor
    const match = url.match(/[?&]cursor=([^&]+)/);
    return match ? decodeURIComponent(match[1] ?? '') : url;
  }
}
