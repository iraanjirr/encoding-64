"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { verifikasiTeman, getVerificationQuestions } from "./actions"
import { notify } from "@/components/notification"
import { Progress } from "@/components/ui/progress"
import type { VerificationQuestion } from "@/lib/db"
import { ThemeToggle } from "@/components/theme-toggle"
import { DecorativeElements, ParallaxBackground } from "@/components/decorative-elements"
import { AnimatedButton } from "@/components/animated-button"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedText } from "@/components/animated-text"

export default function VerifikasiPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [questions, setQuestions] = useState<VerificationQuestion[]>([])
  const [formData, setFormData] = useState({
    nama: "",
    answers: {} as Record<string, string>,
    kodeRahasia: "",
  })
  const [retryCountdown, setRetryCountdown] = useState(0)
  const [progressAnimation, setProgressAnimation] = useState(0)

  // Ambil pertanyaan dari server
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getVerificationQuestions()
        setQuestions(fetchedQuestions)
      } catch (err) {
        console.error("Error fetching questions:", err)
        notify("error", "Gagal memuat pertanyaan verifikasi", 5000)
      }
    }

    fetchQuestions()
  }, [])

  // Animasi progress bar
  useEffect(() => {
    const totalSteps = 3
    const targetProgress = (step / totalSteps) * 100

    // Animate progress
    const start = progressAnimation
    const duration = 500
    const startTime = performance.now()

    const animateProgress = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = easeOutQuad(progress)

      const newValue = start + (targetProgress - start) * easedProgress
      setProgressAnimation(newValue)

      if (progress < 1) {
        requestAnimationFrame(animateProgress)
      }
    }

    requestAnimationFrame(animateProgress)
  }, [step])

  // Easing function
  const easeOutQuad = (x: number): number => {
    return 1 - (1 - x) * (1 - x)
  }

  // Countdown timer untuk retry
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [retryCountdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.startsWith("question_")) {
      const questionId = name.replace("question_", "")
      setFormData((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.nama) {
      notify("warning", "Silakan masukkan nama Anda", 3000)
      return
    }

    if (step === 2) {
      // Validasi jawaban pertanyaan
      const allAnswered = questions.every((q) => formData.answers[q.id])
      if (!allAnswered) {
        notify("warning", "Silakan jawab semua pertanyaan", 3000)
        return
      }
    }

    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await verifikasiTeman({
        nama: formData.nama,
        answers: formData.answers,
        kodeRahasia: formData.kodeRahasia,
      })

      if (result.success) {
        notify("success", "Verifikasi berhasil!", 3000)
        router.push("/sukses")
      } else {
        setError(result.message || "Verifikasi gagal. Silakan coba lagi.")
        notify("error", result.message || "Verifikasi gagal", 5000)

        // Set countdown untuk retry
        if (result.retryAfter) {
          setRetryCountdown(result.retryAfter)
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      notify("error", "Terjadi kesalahan sistem", 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const totalSteps = 3

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 parallax-container">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <ParallaxBackground />
      <DecorativeElements />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <AnimatedCard animation="slideUp" delay={0.3} className="w-full max-w-md z-10 border-2 shadow-lg">
        <CardHeader>
          <AnimatedText
            text="Verifikasi Identitas"
            animation="fadeIn"
            delay={0.5}
            type="heading"
            textEffect="gradientPurple"
            className="text-2xl font-bold"
          />
          <CardDescription className="fade-in-up">
            Jawab pertanyaan berikut untuk membuktikan bahwa kamu adalah teman dekat Airaa Cheisyaa
          </CardDescription>
          <div className="mt-2 relative">
            <Progress value={progressAnimation} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>
                Langkah {step} dari {totalSteps}
              </span>
              <span>{Math.round(progressAnimation)}%</span>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2 fade-in-up">
                  <Label htmlFor="nama" className="text-base">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap kamu"
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Label htmlFor={`question_${question.id}`} className="text-base">
                      <AnimatedText text={question.question} animation="fadeIn" delay={index * 0.1 + 0.2} type="span" />
                    </Label>
                    <Input
                      id={`question_${question.id}`}
                      name={`question_${question.id}`}
                      value={formData.answers[question.id] || ""}
                      onChange={handleInputChange}
                      placeholder="Jawab dengan benar"
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2 fade-in-up">
                  <Label htmlFor="kodeRahasia" className="text-base">
                    Kode Rahasia
                  </Label>
                  <Input
                    id="kodeRahasia"
                    name="kodeRahasia"
                    type="password"
                    value={formData.kodeRahasia}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode rahasia"
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-destructive p-2 bg-destructive/10 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}

                {retryCountdown > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm p-2 bg-muted rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span>Terlalu banyak percobaan. Silakan coba lagi dalam:</span>
                      <span className="font-bold">{retryCountdown} detik</span>
                    </div>
                    <Progress value={(retryCountdown / 30) * 100} className="h-1 mt-2" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <AnimatedButton variant="outline" type="button" onClick={prevStep} hoverEffect="scale">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </AnimatedButton>
            ) : (
              <Link href="/">
                <AnimatedButton variant="outline" type="button" hoverEffect="scale">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Beranda
                </AnimatedButton>
              </Link>
            )}

            {step < totalSteps ? (
              <AnimatedButton type="button" onClick={nextStep} hoverEffect="bounce">
                Lanjut
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="inline-block ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </AnimatedButton>
            ) : (
              <AnimatedButton
                type="submit"
                disabled={isLoading || retryCountdown > 0}
                hoverEffect={isLoading || retryCountdown > 0 ? "none" : "shine"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi"
                )}
              </AnimatedButton>
            )}
          </CardFooter>
        </form>
      </AnimatedCard>
    </main>
  )
}
