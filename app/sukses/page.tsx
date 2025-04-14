"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, Copy, Home, PartyPopper, PhoneIcon as WhatsappIcon, Share2 } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { ThemeToggle } from "@/components/theme-toggle"
import { notify } from "@/components/notification"
import { DecorativeElements, ParallaxBackground } from "@/components/decorative-elements"
import { AnimatedButton } from "@/components/animated-button"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedText } from "@/components/animated-text"

export default function SuksesPage() {
  const [copied, setCopied] = useState(false)
  const whatsappNumber = "+6283874956290" // Ganti dengan nomor WhatsApp yang sebenarnya

  useEffect(() => {
    // Trigger confetti effect when page loads
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff6b81", "#a55eea", "#70a1ff", "#ff4757", "#5352ed"],
        shapes: ["circle", "square"],
      })
    }, 250)

    // Tampilkan notifikasi sukses
    notify("success", "Selamat! Verifikasi berhasil!", 5000)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappNumber)
    setCopied(true)
    notify("success", "Nomor WhatsApp disalin!", 2000)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kontak WhatsApp Airaa Cheisyaa",
          text: `Ini adalah nomor WhatsApp Airaa Cheisyaa: ${whatsappNumber}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`Kontak WhatsApp Airaa Cheisyaa: ${whatsappNumber}`)
      notify("info", "Informasi kontak disalin ke clipboard!", 3000)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 parallax-container">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <ParallaxBackground />
      <DecorativeElements />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <AnimatedCard animation="scale" delay={0.3} className="w-full max-w-md z-10 border-2 shadow-lg">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="mx-auto mb-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <PartyPopper className="h-16 w-16 text-primary" />
            </motion.div>
          </motion.div>

          <AnimatedText
            text="Selamat! Verifikasi Berhasil"
            animation="wordByWord"
            delay={0.7}
            type="heading"
            textEffect="gradientBlue"
            className="text-2xl font-bold"
          />

          <CardDescription className="fade-in-up">
            <AnimatedText
              text="Kamu telah terkonfirmasi sebagai teman dekat Airaa Cheisyaa"
              animation="fadeIn"
              delay={1}
              type="paragraph"
            />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-muted-foreground fade-in-up"
          >
            Berikut adalah nomor WhatsApp yang dapat kamu hubungi:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center justify-center gap-2 p-3 bg-muted rounded-md"
          >
            <AnimatedText
              text={whatsappNumber}
              animation="letterByLetter"
              delay={1.6}
              type="span"
              textEffect="glowBlue"
              className="text-lg font-medium"
            />
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="space-y-3 fade-in-up"
          >
            <Link href={`https://wa.me/${whatsappNumber.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer">
              <AnimatedButton className="w-full gap-2" hoverEffect="bounce">
                <WhatsappIcon className="h-5 w-5" />
                Hubungi Sekarang
              </AnimatedButton>
            </Link>

            <AnimatedButton variant="secondary" className="w-full gap-2" onClick={handleShare} hoverEffect="scale">
              <Share2 className="h-5 w-5" />
              Bagikan Kontak
            </AnimatedButton>
          </motion.div>
        </CardContent>

        <CardFooter>
          <Link href="/" className="w-full">
            <AnimatedButton variant="outline" className="w-full gap-2" hoverEffect="shine">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </AnimatedButton>
          </Link>
        </CardFooter>
      </AnimatedCard>
    </main>
  )
}
