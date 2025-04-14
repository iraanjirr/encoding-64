"use server"

import { v4 as uuidv4 } from "uuid"
import { getServerDb, type VerifiedUser, type VerificationQuestion } from "@/lib/db"

// Password admin (dalam aplikasi nyata, gunakan environment variable)
const ADMIN_PASSWORD = "admin123"

// Login admin
export async function loginAdmin(password: string) {
  // Simulasi delay untuk efek loading
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (password === ADMIN_PASSWORD) {
    return {
      success: true,
    }
  } else {
    return {
      success: false,
      message: "Password admin salah",
    }
  }
}

// Mendapatkan daftar pengguna terverifikasi
export async function getVerifiedUsers(): Promise<VerifiedUser[]> {
  const db = getServerDb()
  return db.getAllVerifiedUsers()
}

// Mendapatkan daftar pertanyaan verifikasi
export async function getQuestions(): Promise<VerificationQuestion[]> {
  const db = getServerDb()
  return db.getQuestions(100) // Ambil semua pertanyaan
}

// Menambahkan pertanyaan baru
export async function addQuestion(question: string, answer: string) {
  const db = getServerDb()
  const newQuestion: VerificationQuestion = {
    id: uuidv4(),
    question,
    answer,
  }

  return db.addQuestion(newQuestion)
}

// Memperbarui pertanyaan
export async function updateQuestion(id: string, question: string, answer: string) {
  const db = getServerDb()
  return db.updateQuestion(id, { question, answer })
}

// Menghapus pertanyaan
export async function deleteQuestion(id: string) {
  const db = getServerDb()
  return db.deleteQuestion(id)
}
