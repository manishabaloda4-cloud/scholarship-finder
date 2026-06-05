import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    console.log("Verifying:", email, code);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    console.log("Found rows:", data?.length, "Error:", error?.message);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
    }

    const record = data[0];

    await supabase.from("otp_codes").update({ used: true }).eq("id", record.id);

    return NextResponse.json({ success: true, name: record.name, email: record.email });

  } catch (err: any) {
    console.error("VERIFY ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}