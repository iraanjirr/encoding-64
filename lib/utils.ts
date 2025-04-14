import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi untuk menangani error dengan lebih baik
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// Fungsi untuk memformat waktu
export function formatTime(date: Date | number): string {
  if (typeof date === "number") {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Fungsi untuk sanitasi input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Fungsi untuk deteksi perangkat mobile
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Fungsi untuk mengecek dukungan Web Audio API
export function isWebAudioSupported(): boolean {
  return typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext)
}
