
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(import.meta.env.VITE_EDIT_JWT_SECRET)

export type EditClaims = {
  sub: string
  tid: string
  role: 'admin'|'editor'|'viewer'
}

export async function signEditToken(claims: EditClaims) {
  return await new SignJWT(claims as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(SECRET)
}

export async function verifyEditToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload as unknown as EditClaims
}
