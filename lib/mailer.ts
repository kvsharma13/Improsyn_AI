import nodemailer from "nodemailer";

export async function sendOTPEmail(to: string, otp: string) {
  console.log("📨 Sending OTP via Gmail SMTP...");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Use this code to verify your account:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log(`📧 OTP sent to ${to}`);
  } catch (error) {
    console.error("❌ Gmail Email sending failed:", error);
  }
}
