"use server"

import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"
import { getServerDb, type VerificationQuestion } from "@/lib/db"
import { createToken } from "@/lib/auth"

// Kode rahasia
const KODE_RAHASIA = "airaa123"

// Fungsi untuk mendapatkan pertanyaan verifikasi
export async function getVerificationQuestions(): Promise<VerificationQuestion[]> {
  const db = getServerDb()
  return db.getQuestions(2) // Ambil 2 pertanyaan acak
}

// Fungsi untuk verifikasi teman
export async function verifikasiTeman(data: {
  nama: string
  answers: Record<string, string>
  kodeRahasia: string
}) {
  // Simulasi delay untuk efek loading
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const { nama, answers, kodeRahasia } = data
  const db = getServerDb()

  // Validasi input
  if (!nama || !kodeRahasia || Object.keys(answers).length === 0) {
    return {
      success: false,
      message: "Semua field harus diisi",
    }
  }

  // Verifikasi kode rahasia
  const isKodeBenar = kodeRahasia === KODE_RAHASIA

  // Verifikasi jawaban
  let correctAnswers = 0
  let totalQuestions = 0

  for (const questionId in answers) {
    const question = db.getQuestion(questionId)
    if (question) {
      totalQuestions++
      if (answers[questionId].toLowerCase().includes(question.answer.toLowerCase())) {
        correctAnswers++
      }
    }
  }

  // Hitung persentase jawaban benar
  const percentageCorrect = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

  // Verifikasi berhasil jika kode benar dan minimal 70% jawaban benar
  if (isKodeBenar && percentageCorrect >= 70) {
    // Buat ID unik untuk pengguna
    const userId = uuidv4()

    // Simpan pengguna terverifikasi di database
    db.addVerifiedUser({
      id: userId,
      nama,
      timestamp: Date.now(),
    })

    // Buat token JWT
    const token = await createToken({ userId, nama })

    // Simpan token di cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    })

    return {
      success: true,
    }
  } else {
    // Tentukan pesan error yang spesifik
    let message = "Verifikasi gagal. "

    if (!isKodeBenar) {
      message += "Kode rahasia tidak sesuai. "
    }

    if (percentageCorrect < 70) {
      message += `Jawaban pertanyaan kurang tepat (${Math.floor(percentageCorrect)}% benar).`
    }

    // Cek apakah perlu menerapkan cooldown
    const cookieStore = cookies()
    const failedAttempts = Number.parseInt(cookieStore.get("failed_attempts")?.value || "0")

    if (failedAttempts >= 3) {
      // Terlalu banyak percobaan, terapkan cooldown
      cookieStore.set("failed_attempts", "0", { path: "/" })
      cookieStore.set("cooldown_until", (Date.now() + 30000).toString(), { path: "/" }) // 30 detik cooldown

      return {
        success: false,
        message: message,
        retryAfter: 30, // 30 detik
      }
    } else {
      // Tambah jumlah percobaan gagal
      cookieStore.set("failed_attempts", (failedAttempts + 1).toString(), { path: "/" })
    }

    return {
      success: false,
      message: message,
    }
  }
}
