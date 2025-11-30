import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { hashPassword, validateEmail, validatePassword, generateOTP } from '@/lib/auth'
import { sendOTPEmail } from '@/lib/mailer'  // <-- NEW IMPORT

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      )
    }

    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email, email_verified')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (checkError) {
      console.error('Database check error:', checkError)
      return NextResponse.json(
        { success: false, message: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    if (existingUser) {
      if (!existingUser.email_verified) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Account exists but email not verified. Please check your email for verification code.',
            requiresVerification: true,
            email: existingUser.email
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists. Please login instead.' },
        { status: 409 }
      )
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    const passwordHash = await hashPassword(password)

    const { data: createdUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: false,
        verification_code: otp,
        verification_code_expires: otpExpiry.toISOString()
      }])
      .select('id, email')
      .single()

    if (insertError || !createdUser) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

    // 🔥 NEW — Send Email OTP
    await sendOTPEmail(email, otp)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 EMAIL VERIFICATION OTP SENT')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📩 Email: ${email}`)
    console.log(`🔢 OTP Code: ${otp}`)
    console.log(`⏰ Expires: ${otpExpiry.toLocaleString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return NextResponse.json({
      success: true,
      message: 'Account created! OTP sent to your email.',
      requiresVerification: true,
      email: createdUser.email,
    }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
