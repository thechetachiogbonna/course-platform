import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatString = ({ number, plural, singular }: { number: number; plural: string; singular: string }) => {
  return number === 1 ? `${number} ${singular}` : `${number} ${plural}`;
}

export function formatPrice(amount: number, { showZeroAsNumber = false } = {}) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  })

  if (amount === 0 && !showZeroAsNumber) return "Free"
  return formatter.format(amount)
}