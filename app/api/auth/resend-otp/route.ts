import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { generateOTP } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

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

    if (user.email_verified) {
      return NextResponse.json(
        { success: false, message: 'Email already verified. Please login.' },
        { status: 400 }
      )
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        verification_code: otp,
        verification_code_expires: otpExpiry.toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Failed to resend code. Please try again.' },
        { status: 500 }
      )
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔄 RESENT VERIFICATION OTP')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📩 Email: ${email}`)
    console.log(`🔢 New OTP Code: ${otp}`)
    console.log(`⏰ Expires: ${otpExpiry.toLocaleString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return NextResponse.json({
      success: true,
      message: 'New verification code sent! Check the server console.',
    }, { status: 200 })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to resend code. Please try again.' },
      { status: 500 }
    )
  }
}
