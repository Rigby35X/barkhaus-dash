import { NextRequest, NextResponse } from 'next/server'

// Mock session storage - in real app, use database
let activeSessions: Record<string, { userId: string; timestamp: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json()
    
    // Check for existing active sessions
    const existingSessions = Object.entries(activeSessions)
      .filter(([_, session]) => session.userId !== userId)
      .filter(([_, session]) => Date.now() - session.timestamp < 30 * 60 * 1000) // 30 minutes
    
    if (existingSessions.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Another user is currently editing the website'
      })
    }
    
    // Create new session
    activeSessions[sessionId] = {
      userId,
      timestamp: Date.now()
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    delete activeSessions[sessionId]
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    )
  }
}
