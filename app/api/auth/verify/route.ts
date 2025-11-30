import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
      // Token is invalid or expired
      const response = NextResponse.json(
        { success: false, message: 'Session expired. Please login again.' },
        { status: 401 }
      )
      
      // Clear invalid cookie
      response.cookies.delete('auth-token')
      
      return response
    }

    // Token is valid
    return NextResponse.json(
      {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication verification failed' },
      { status: 500 }
    )
  }
}
