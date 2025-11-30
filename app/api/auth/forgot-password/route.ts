import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { generateOTP } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    // To avoid revealing user existence, always return success
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If the account exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await supabaseAdmin
      .from("users")
      .update({
        reset_code: otp,
        reset_code_expires: expires.toISOString(),
      })
      .eq("id", user.id);

    // Send OTP mail
    await sendOTPEmail(user.email, otp);

    return NextResponse.json({
      success: true,
      message: "Password reset OTP sent to email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
