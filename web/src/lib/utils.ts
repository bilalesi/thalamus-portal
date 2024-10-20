import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ensureArray = (obj: any) => {
  if (Array.isArray(obj)) return obj;
  else return [obj];
}