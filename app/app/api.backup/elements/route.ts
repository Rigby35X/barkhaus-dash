import { NextRequest, NextResponse } from 'next/server'

// Mock database - in real app, use Supabase or your preferred database
let elements = {
  'home-hero-title': { content: 'Welcome to Barkhaus', type: 'text' },
  'home-hero-subtitle': { content: 'Adoption, care, and community—everything we do is for pets who deserve a loving home.', type: 'text' },

  'about-title': { content: 'Barkhaus Story', type: 'text' },
  'about-blurb': { content: 'We provide exceptional care, rehabilitation, and placement for pets in need—powered by a passionate team and loving community.', type: 'text' },
  'about-page-title': { content: 'About Barkhaus', type: 'text' },
  'about-page-body': { content: 'Barkhaus is dedicated to rescuing pets, providing compassionate care, and connecting them with loving families. Our team specializes in rehabilitation, enrichment, and responsible placement.', type: 'text' },
  'about-image': { type: 'image', src: '/placeholder.svg?height=360&width=560' },

  'animals-title': { content: 'Featured Friends', type: 'text' },
  'animals-page-title': { content: 'Available Animals', type: 'text' },

  'applications-title': { content: 'Become Part of Their Journey', type: 'text' },
  'applications-page-title': { content: 'Applications', type: 'text' },

  'donate-title': { content: 'Your Gift Saves Lives', type: 'text' },
  'donate-blurb': { content: 'Donations provide food, shelter, medical care, and training—ensuring every pet has a chance at a loving home.', type: 'text' },
  'donate-page-title': { content: 'Make a Difference Today', type: 'text' },
  'donate-page-body': { content: 'Your support funds medical care, enrichment, and placement efforts for pets in need.', type: 'text' },
  'donate-image': { type: 'image', src: '/placeholder.svg?height=360&width=560' },

  'events-title': { content: 'Upcoming Events', type: 'text' },
  'events-page-title': { content: 'Events', type: 'text' },

  'contact-title': { content: 'We’d Love to Hear From You', type: 'text' },
  'contact-blurb': { content: 'Questions about adoption, volunteering, or donations? Our team is here to help.', type: 'text' },
  'contact-page-title': { content: 'Contact Us', type: 'text' },
  'contact-page-body': { content: 'Reach out to our team for adoption, volunteering, fostering, or general inquiries.', type: 'text' },
  'contact-image': { type: 'image', src: '/placeholder.svg?height=360&width=560' },

  'home-cta-primary': { type: 'button', content: 'Find a Friend', link: '/animals' },
  'home-cta-secondary': { type: 'button', content: 'Donate', link: '/donate' },

  // Section styling examples
  'hero-section': { type: 'section', visible: true, background: '#ffffff', opacity: 1 },
  'about-section': { type: 'section', visible: true, background: '#ffffff', opacity: 1 },
}

export async function GET() {
  return NextResponse.json({ elements })
}

export async function POST(request: NextRequest) {
  try {
    const { elementId, data, userId } = await request.json()
    
    // Update element
    elements[elementId] = { ...elements[elementId], ...data }
    
    // Log the change (in real app, save to audit table)
    console.log(`User ${userId} updated element ${elementId}:`, data)
    
    return NextResponse.json({ 
      success: true, 
      element: elements[elementId] 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update element' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body || !body.elements) {
      return NextResponse.json({ error: 'Missing elements' }, { status: 400 })
    }
    elements = { ...elements, ...body.elements }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
