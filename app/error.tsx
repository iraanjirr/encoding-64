"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke layanan monitoring
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md border-2 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 text-destructive"
            >
              <AlertTriangle size={48} />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Terjadi Kesalahan</CardTitle>
            <CardDescription>Maaf, terjadi kesalahan saat memproses permintaan Anda.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || "Silakan coba lagi atau kembali ke halaman beranda."}
            </p>
            {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
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
