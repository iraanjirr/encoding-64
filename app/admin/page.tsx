"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Loader2, Plus, Save, Trash } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { notify } from "@/components/notification"
import { loginAdmin, getVerifiedUsers, getQuestions, addQuestion, updateQuestion, deleteQuestion } from "./actions"
import type { VerifiedUser, VerificationQuestion } from "@/lib/db"
import { DecorativeElements, ParallaxBackground } from "@/components/decorative-elements"
import { AnimatedButton } from "@/components/animated-button"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedText } from "@/components/animated-text"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([])
  const [questions, setQuestions] = useState<VerificationQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<VerificationQuestion | null>(null)
  const [newQuestion, setNewQuestion] = useState({ question: "", answer: "" })
  const [activeTab, setActiveTab] = useState("users")

  // Cek status autentikasi dari localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  // Fungsi untuk memuat data
  const loadData = async () => {
    setIsLoading(true)
    try {
      const [usersData, questionsData] = await Promise.all([getVerifiedUsers(), getQuestions()])

      setVerifiedUsers(usersData)
      setQuestions(questionsData)
    } catch (error) {
      console.error("Error loading data:", error)
      notify("error", "Gagal memuat data", 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle login admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginAdmin(adminPassword)

      if (result.success) {
        setIsAuthenticated(true)
        localStorage.setItem("admin_authenticated", "true")
        notify("success", "Login berhasil!", 3000)
        loadData()
      } else {
        notify("error", "Password admin salah", 5000)
      }
    } catch (error) {
      console.error("Login error:", error)
      notify("error", "Terjadi kesalahan saat login", 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle tambah pertanyaan baru
  const handleAddQuestion = async () => {
    if (!newQuestion.question || !newQuestion.answer) {
      notify("warning", "Pertanyaan dan jawaban harus diisi", 3000)
      return
    }

    setIsLoading(true)
    try {
      await addQuestion(newQuestion.question, newQuestion.answer)
      notify("success", "Pertanyaan berhasil ditambahkan", 3000)
      setNewQuestion({ question: "", answer: "" })
      loadData()
    } catch (error) {
      console.error("Error adding question:", error)
      notify("error", "Gagal menambahkan pertanyaan", 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle update pertanyaan
  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editingQuestion.question || !editingQuestion.answer) {
      notify("warning", "Pertanyaan dan jawaban harus diisi", 3000)
      return
    }

    setIsLoading(true)
    try {
      await updateQuestion(editingQuestion.id, editingQuestion.question, editingQuestion.answer)
      notify("success", "Pertanyaan berhasil diperbarui", 3000)
      setEditingQuestion(null)
      loadData()
    } catch (error) {
      console.error("Error updating question:", error)
      notify("error", "Gagal memperbarui pertanyaan", 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle hapus pertanyaan
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pertanyaan ini?")) {
      return
    }

    setIsLoading(true)
    try {
      await deleteQuestion(id)
      notify("success", "Pertanyaan berhasil dihapus", 3000)
      loadData()
    } catch (error) {
      console.error("Error deleting question:", error)
      notify("error", "Gagal menghapus pertanyaan", 5000)
    } finally {
      setIsLoading(false)
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

      {!isAuthenticated ? (
        <AnimatedCard animation="slideUp" delay={0.3} className="w-full max-w-md z-10 border-2 shadow-lg">
          <CardHeader>
            <AnimatedText
              text="Admin Login"
              animation="fadeIn"
              delay={0.5}
              type="heading"
              textEffect="gradientPurple"
              className="text-2xl font-bold"
            />
            <CardDescription className="fade-in-up">
              Masukkan password admin untuk mengakses panel admin
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2 fade-in-up">
                <Label htmlFor="password">Password Admin</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/">
                <AnimatedButton variant="outline" type="button" hoverEffect="scale">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </AnimatedButton>
              </Link>

              <AnimatedButton type="submit" disabled={isLoading} hoverEffect={isLoading ? "none" : "shine"}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Login"
                )}
              </AnimatedButton>
            </CardFooter>
          </form>
        </AnimatedCard>
      ) : (
        <AnimatedCard animation="fadeIn" delay={0.3} className="w-full max-w-4xl z-10 border-2 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <AnimatedText
                text="Admin Panel"
                animation="fadeIn"
                delay={0.5}
                type="heading"
                textEffect="gradientBlue"
                className="text-2xl font-bold"
              />
              <Link href="/">
                <AnimatedButton variant="outline" size="sm" hoverEffect="scale">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </AnimatedButton>
              </Link>
            </div>
            <CardDescription className="fade-in-up">
              Kelola pertanyaan verifikasi dan lihat pengguna terverifikasi
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="relative overflow-hidden">
                  <span>Pengguna Terverifikasi</span>
                  {activeTab === "users" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger value="questions" className="relative overflow-hidden">
                  <span>Pertanyaan Verifikasi</span>
                  {activeTab === "questions" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-4">
                <div className="rounded-md border fade-in-up">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Waktu Verifikasi</TableHead>
                        <TableHead>Percobaan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifiedUsers.length > 0 ? (
                        verifiedUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">{user.nama}</TableCell>
                            <TableCell>{new Date(user.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{user.attemptCount || 1}</TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            {isLoading ? "Memuat data..." : "Belum ada pengguna terverifikasi"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-4 space-y-4">
                {/* Form tambah pertanyaan baru */}
                <AnimatedCard animation="fadeIn" delay={0.3} hoverEffect={false} className="fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <AnimatedText
                        text="Tambah Pertanyaan Baru"
                        animation="fadeIn"
                        type="heading"
                        textEffect="gradientPurple"
                        className="text-lg font-bold"
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-question">Pertanyaan</Label>
                      <Input
                        id="new-question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        placeholder="Masukkan pertanyaan baru"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-answer">Jawaban</Label>
                      <Input
                        id="new-answer"
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        placeholder="Masukkan jawaban"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:scale-[1.01] bg-background"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AnimatedButton
                      onClick={handleAddQuestion}
                      disabled={isLoading}
                      className="gap-2"
                      hoverEffect="bounce"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Pertanyaan
                    </AnimatedButton>
                  </CardFooter>
                </AnimatedCard>

                {/* Daftar pertanyaan */}
                <div className="rounded-md border fade-in-up">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pertanyaan</TableHead>
                        <TableHead>Jawaban</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.length > 0 ? (
                        questions.map((question, index) => (
                          <motion.tr
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <TableCell>
                              {editingQuestion?.id === question.id ? (
                                <Input
                                  value={editingQuestion.question}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                                  className="transition-all duration-300 focus:ring-2 focus:ring-primary bg-background"
                                />
                              ) : (
                                question.question
                              )}
                            </TableCell>
                            <TableCell>
                              {editingQuestion?.id === question.id ? (
                                <Input
                                  value={editingQuestion.answer}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                                  className="transition-all duration-300 focus:ring-2 focus:ring-primary bg-background"
                                />
                              ) : (
                                question.answer
                              )}
                            </TableCell>
                            <TableCell>
                              {editingQuestion?.id === question.id ? (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button size="icon" variant="ghost" onClick={handleUpdateQuestion}>
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              ) : (
                                <div className="flex gap-1">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button size="icon" variant="ghost" onClick={() => setEditingQuestion(question)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            {isLoading ? "Memuat data..." : "Belum ada pertanyaan verifikasi"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </AnimatedCard>
      )}
    </main>
  )
}
