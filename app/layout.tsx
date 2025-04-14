import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { NotificationContainer } from "@/components/notification"
import { PageTransition } from "@/components/page-transition"
import { ScrollAnimationObserver } from "@/components/decorative-elements"
import { CustomCursor } from "@/components/decorative-elements"
import { AudioPlayerButton } from "@/components/audio-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Verifikasi Teman Dekat",
  description: "Verifikasi identitas sebagai teman dekat Airaa Cheisyaa",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ScrollAnimationObserver>
            <PageTransition>{children}</PageTransition>
          </ScrollAnimationObserver>
          <NotificationContainer />
          <Analytics />
          <CustomCursor />
          <AudioPlayerButton />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'