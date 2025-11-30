import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { success: false, message: 'Email already verified. Please login.' },
        { status: 400 }
      )
    }

    // Check OTP expiry
    const now = new Date()
    const expiryDate = new Date(user.verification_code_expires)
    
    if (now > expiryDate) {
      return NextResponse.json(
        { success: false, message: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (user.verification_code !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      )
    }

    // Mark email as verified
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_code: null,
        verification_code_expires: null
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Failed to verify email. Please try again.' },
        { status: 500 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! Redirecting to voice agent...',
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log(`✅ Email verified successfully for: ${email}`)

    return response
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
