import { NextRequest, NextResponse } from "next/server"

// already created before; re-affirm presence. No change.
// This route is used by persistXanoTokenToCookie() to set HTTP-only cookie.
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })
    const res = NextResponse.json({ ok: true })
    res.cookies.set("xano_token", token, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("xano_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 })
  return res
}
