// Simulasi database dengan localStorage di client dan Map di server
// Dalam aplikasi nyata, gunakan database seperti MongoDB, PostgreSQL, atau Supabase

// Tipe data untuk pengguna terverifikasi
export type VerifiedUser = {
  id: string
  nama: string
  timestamp: number
  attemptCount?: number
}

// Tipe data untuk pertanyaan verifikasi
export type VerificationQuestion = {
  id: string
  question: string
  answer: string
}

// Class database untuk server
class ServerDatabase {
  private verifiedUsers: Map<string, VerifiedUser>
  private verificationQuestions: Map<string, VerificationQuestion>

  constructor() {
    this.verifiedUsers = new Map()
    this.verificationQuestions = new Map([
      ["q1", { id: "q1", question: "Apa makanan favorit Airaa?", answer: "sushi" }],
      ["q2", { id: "q2", question: "Di mana tempat hangout favorit kalian?", answer: "mall" }],
      ["q3", { id: "q3", question: "Apa film favorit Airaa?", answer: "romance" }],
      ["q4", { id: "q4", question: "Apa warna favorit Airaa?", answer: "pink" }],
    ])
  }

  // Metode untuk pengguna terverifikasi
  addVerifiedUser(user: VerifiedUser) {
    this.verifiedUsers.set(user.id, user)
    return user
  }

  getVerifiedUser(id: string) {
    return this.verifiedUsers.get(id)
  }

  getAllVerifiedUsers() {
    return Array.from(this.verifiedUsers.values())
  }

  // Metode untuk pertanyaan verifikasi
  getQuestions(count = 2) {
    const questions = Array.from(this.verificationQuestions.values())
    // Acak dan ambil sejumlah pertanyaan
    return questions.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  getQuestion(id: string) {
    return this.verificationQuestions.get(id)
  }

  addQuestion(question: VerificationQuestion) {
    this.verificationQuestions.set(question.id, question)
    return question
  }

  updateQuestion(id: string, data: Partial<VerificationQuestion>) {
    const question = this.verificationQuestions.get(id)
    if (!question) return null

    const updatedQuestion = { ...question, ...data }
    this.verificationQuestions.set(id, updatedQuestion)
    return updatedQuestion
  }

  deleteQuestion(id: string) {
    const success = this.verificationQuestions.delete(id)
    return success
  }

  // Metode untuk mencatat percobaan verifikasi
  recordAttempt(userId: string) {
    const user = this.verifiedUsers.get(userId)
    if (user) {
      user.attemptCount = (user.attemptCount || 0) + 1
      this.verifiedUsers.set(userId, user)
    }
    return user
  }
}

// Singleton instance untuk server
let db: ServerDatabase

export function getServerDb() {
  if (!db) {
    db = new ServerDatabase()
  }
  return db
}

// Fungsi untuk client-side storage
export function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function getFromLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

export function removeFromLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}
