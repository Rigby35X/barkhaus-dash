import { NextResponse } from 'next/server'
import { XANO_GROUPS } from '@/lib/xano-groups'
import { getServerXanoToken } from '@/lib/server/xano-auth'

export async function GET() {
  const token = await getServerXanoToken()
  return NextResponse.json({
    ok: true,
    groups: XANO_GROUPS,
    tokenDetected: Boolean(token),
    notes: [
      'Client requests forward the token via x-xano-token header (from localStorage).',
      'Server routes read the HTTP-only cookie xano_token, if present.',
      'Visit /studio/home to test inline editor controls and saving.',
    ],
  })
}
