import { NextResponse } from "next/server"

// Temporarily disabled Xano imports to prevent undefined URL errors
// import { xanoFetch } from "@/lib/xano"
// import { getServerXanoToken } from "@/lib/server/xano-auth"

export async function GET(_: Request, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    // Temporarily return mock data to prevent undefined URL errors
    return NextResponse.json({
      orgName: 'Barkhaus',
      tagline: 'Caring for pets. Building forever homes.',
      logoUrl: '',
      primaryColor: '#16a34a',
      secondaryColor: '#0f766e',
      fontBody: 'Inter, ui-sans-serif, system-ui',
      fontHeading: 'Poppins, ui-sans-serif, system-ui',
      addressLine1: '1234 Wagging Tail Rd',
      addressLine2: 'Barkville, BH 00000',
      email: 'hello@barkhaus.com',
      phone: '(555) 123-4567',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const { orgId } = await params; // Await params as required by Next.js
    const body = await request.json();

    // Temporarily return mock updated data to prevent undefined URL errors
    // In production, this would save to Xano and return the updated data
    const updatedData = {
      orgName: body.orgName || 'Barkhaus',
      tagline: body.tagline || 'Caring for pets. Building forever homes.',
      logoUrl: body.logoUrl || '',
      primaryColor: body.primaryColor || '#16a34a',
      secondaryColor: body.secondaryColor || '#0f766e',
      fontBody: body.fontBody || 'Inter, ui-sans-serif, system-ui',
      fontHeading: body.fontHeading || 'Poppins, ui-sans-serif, system-ui',
      addressLine1: body.addressLine1 || '1234 Wagging Tail Rd',
      addressLine2: body.addressLine2 || 'Barkville, BH 00000',
      email: body.email || 'hello@barkhaus.com',
      phone: body.phone || '(555) 123-4567',
    };

    return NextResponse.json(updatedData);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}