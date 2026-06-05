import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { profile, scholarship } = await req.json();

  const prompt = `Student applying for: ${scholarship.name} by ${scholarship.provider}
Documents needed: ${scholarship.documents.join(", ")}
Student: State=${profile.state}, Category=${profile.category}, Income=${profile.annualIncome}, Disabled=${profile.isDisabled}
Return JSON array. Each item: { "doc": string, "where": string, "note": string, "required": boolean }
Return ONLY raw JSON array. No markdown, no code fences.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = completion.choices[0].message.content?.trim() ?? "[]";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const checklist = JSON.parse(cleaned);
    return NextResponse.json({ checklist });
  } catch (err) {
    console.error("Checklist error:", err);
    return NextResponse.json({ error: "Checklist failed" }, { status: 500 });
  }
}