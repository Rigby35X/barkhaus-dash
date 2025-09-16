import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Persistent image uploads (public) organized by orgId.
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const orgId = url.searchParams.get('orgId') || 'default'
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const blob = await put(`barkhaus/${orgId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
