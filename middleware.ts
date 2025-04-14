import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Dalam aplikasi nyata, kita akan memeriksa session/cookie untuk verifikasi
  // Untuk contoh ini, kita akan mengizinkan akses ke halaman sukses jika datang dari halaman verifikasi

  const referer = request.headers.get("referer") || ""
  const isFromVerifikasi = referer.includes("/verifikasi")

  // Jika mencoba mengakses halaman sukses tanpa melalui verifikasi
  if (request.nextUrl.pathname === "/sukses" && !isFromVerifikasi) {
    return NextResponse.redirect(new URL("/verifikasi", request.url))
  }

  // Tambahkan header keamanan
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/sukses/:path*"],
}
