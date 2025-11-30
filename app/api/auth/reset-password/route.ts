import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(newPassword);

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        password_hash,
        reset_code: null,
        reset_code_expires: null,
      })
      .eq("email", email.toLowerCase());

    if (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Unable to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
