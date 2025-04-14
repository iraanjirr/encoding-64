"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md border-2 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 text-primary"
            >
              <Search size={48} />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Halaman Tidak Ditemukan</CardTitle>
            <CardDescription>Maaf, halaman yang Anda cari tidak dapat ditemukan.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Halaman mungkin telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
