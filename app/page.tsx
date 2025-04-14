"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Heart, Share2, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { notify } from "@/components/notification"
import { DecorativeElements, ParallaxBackground } from "@/components/decorative-elements"
import { AnimatedButton } from "@/components/animated-button"
import { AnimatedText } from "@/components/animated-text"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Tampilkan notifikasi selamat datang
    notify("info", "Selamat datang di portal verifikasi teman dekat Airaa Cheisyaa!", 5000)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verifikasi Teman Dekat Airaa Cheisyaa",
          text: "Buktikan bahwa kamu adalah teman dekat Airaa Cheisyaa!",
          url: window.location.href,
        })
        notify("success", "Berhasil membagikan!", 3000)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      notify("success", "Link disalin ke clipboard!", 3000)
    }
  }

  if (!mounted) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden parallax-container">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <ParallaxBackground />
      <DecorativeElements />

      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
            <Share2 className="h-5 w-5" />
          </Button>
        </motion.div>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-6 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Heart className="h-16 w-16 text-primary" />
          </motion.div>
        </motion.div>

        <div className="mb-6">
          <AnimatedText
            text="Verifikasi"
            animation="wordByWord"
            delay={0.5}
            type="heading"
            className="text-4xl md:text-6xl font-bold inline-block mr-3"
          />
          <AnimatedText
            text="Teman Dekat"
            animation="wordByWord"
            delay={0.7}
            type="heading"
            textEffect="gradient"
            className="text-4xl md:text-6xl font-bold inline-block"
          />
          <AnimatedText
            text="Airaa Cheisyaa"
            animation="wordByWord"
            delay={0.9}
            type="heading"
            textEffect="glow"
            className="text-4xl md:text-6xl font-bold block mt-2"
          />
        </div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-8 fade-in-up"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          Welcome!!><, di portal verifikasi teman dekatkuu. Buktikan bahwa kamu adalah teman dekat Airaa Cheisyaa untuk
          mendapatkan akses kontak WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/verifikasi">
            <AnimatedButton size="lg" className="group" hoverEffect="bounce">
              Mulai Verifikasi
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
                className="inline-block ml-2"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </AnimatedButton>
          </Link>
          <Link href="/admin">
            <AnimatedButton size="lg" variant="outline" hoverEffect="scale">
              Admin Panel
            </AnimatedButton>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
          }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
        <span>Dibuat oleh Salsa && Airaa</span>
      </motion.div>
    </main>
  )
}
