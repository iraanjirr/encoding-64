"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Fungsi untuk mencatat pageview
    const logPageView = (url: string) => {
      // Dalam aplikasi nyata, kirim data ke layanan analitik seperti Google Analytics
      console.log(`[Analytics] Page view: ${url}`)

      // Simpan data pageview di localStorage untuk demo
      const views = JSON.parse(localStorage.getItem("pageViews") || "[]")
      views.push({
        url,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("pageViews", JSON.stringify(views))
    }

    // Mencatat pageview saat komponen dimount
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    logPageView(url)
  }, [pathname, searchParams])

  return null
}
