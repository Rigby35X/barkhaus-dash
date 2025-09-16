import { NextRequest, NextResponse } from 'next/server'
import { xanoFetch } from '@/lib/xano'

// Adjust this to match your Xano auth endpoint path in the primary group.
const AUTH_GROUP = 'primary' as const
const LOGIN_PATH = '/auth/login'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Expecting { email, password }
    const data = await xanoFetch({
      group: AUTH_GROUP,
      path: LOGIN_PATH,
      init: { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } },
    })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
