import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatString = ({ number, plural, singular }: { number: number; plural: string; singular: string }) => {
  return number === 1 ? `${number} ${singular}` : `${number} ${plural}`;
}
