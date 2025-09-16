// app/api/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Xano } from '@/lib/xanoClient';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const { snapshot, orgId } = await req.json();
  await Xano.publishLiveSite(snapshot, orgId);
  revalidateTag('live-site'); // 👈 will refresh any fetch tagged 'live-site'
  return NextResponse.json({ ok: true });
}