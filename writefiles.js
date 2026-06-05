var fs=require('fs');

fs.writeFileSync('app/api/match/route.ts', ["import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import scholarships from '@/data/scholarships.json';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { profile } = await req.json();
  const candidates = scholarships.filter((s) => {
    const e = s.eligibility;
    if (e.maxIncome > 0 && profile.annualIncome > e.maxIncome) return false;
    if (e.minMarks > 0 && profile.marks < e.minMarks) return false;
    if (e.gender !== 'All' && e.gender !== profile.gender) return false;
    if (!e.categories.includes('All') && !e.categories.includes(profile.category)) return false;
    return true;
  });
  const prompt = 'You are a scholarship eligibility expert for Indian students. Student: ' + JSON.stringify(profile) + ' Scholarships: ' + JSON.stringify(candidates) + ' Return a JSON array. Each object: id, score(0-100), eligible(bool), reason(2 sentences), missingDocs(array). Return ONLY raw JSON array.';
  try {
    const completion = await groq.chat.completions.create({ model: 'llama-3.3-70b-versatile', max_tokens: 2000, temperature: 0.1, messages: [{ role: 'user', content: prompt }] });
    const raw = completion.choices[0].message.content?.trim() ?? '[]';
    const cleaned = raw.replace(/`json|`/g, '').trim();
    const results = JSON.parse(cleaned);
    const enriched = results.map((r: any) => { const scholarship = candidates.find((s) => s.id === r.id); return scholarship ? { scholarship, ...r } : null; }).filter(Boolean).sort((a: any, b: any) => b.score - a.score);
    return NextResponse.json({ results: enriched });
  } catch (err) {
    console.error('Match error:', err);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
"].join(""));