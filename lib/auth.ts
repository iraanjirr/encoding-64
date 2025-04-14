import { jwtVerify, SignJWT } from "jose"

// Dalam aplikasi nyata, gunakan environment variable
const JWT_SECRET = new TextEncoder().encode("rahasia-jwt-verifikasi-teman")

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { success: true, data: payload }
  } catch (error) {
    return { success: false, error: "Token tidak valid" }
  }
}
