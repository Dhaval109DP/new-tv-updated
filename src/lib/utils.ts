import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[()]/g, ''); // Remove parentheses
