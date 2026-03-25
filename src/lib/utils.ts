import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price from cents to display string
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

// Format date to human-readable string
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Format duration from minutes to readable string
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}min`;
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Get booking status color for Badge
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-stone-100 text-stone-800";
}
