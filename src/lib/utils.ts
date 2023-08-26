import { Currency } from "@/app/lib/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: Currency) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}
