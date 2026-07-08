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

export const isProductNew = (productCreatedAt: Date) => {
  const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;
  return new Date(productCreatedAt).getTime() > (new Date().getTime() - SEVEN_DAYS_IN_MS);
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}