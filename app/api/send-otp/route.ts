import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: dbError } = await supabase
      .from("otp_codes")
      .insert({ email, name, code, expires_at });

    if (dbError) {
      console.error("DB INSERT ERROR:", dbError.message);
      return NextResponse.json({ error: "Database error: " + dbError.message }, { status: 500 });
    }

    console.log("Code saved:", code, "for", email);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your ScholarshipFinder verification code",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h1 style="font-size:24px;font-weight:600;margin-bottom:8px">Hi ${name}!</h1>
        <p style="color:#6b7280;margin-bottom:24px">Your verification code:</p>
        <div style="background:#f5f3ff;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
          <p style="font-size:40px;font-weight:700;letter-spacing:12px;color:#4338ca;margin:0">${code}</p>
        </div>
        <p style="color:#6b7280;font-size:14px">Valid for 10 minutes.</p>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SEND OTP ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}