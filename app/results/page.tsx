"use client";
import { useEffect, useState } from "react";
import { loadProfile, saveToTracker } from "@/lib/storage";
import { MatchResult } from "@/lib/types";
import { Bookmark, ExternalLink, ChevronDown, ChevronUp, CheckCircle, Sparkles, Clock, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [checklists, setChecklists] = useState<Record<string, any[]>>({});
  const [loadingChecklist, setLoadingChecklist] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const profile = loadProfile();
    if (!profile) { setError("No profile found. Please fill your profile first."); setLoading(false); return; }
    fetch("/api/match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile }) })
      .then((r) => r.json())
      .then((data) => { if (data.error) setError(data.error); else setResults(data.results ?? []); setLoading(false); })
      .catch(() => { setError("Something went wrong. Please try again."); setLoading(false); });
  }, []);

  async function toggleExpand(result: MatchResult) {
    const id = result.scholarship.id;
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (checklists[id]) return;
    setLoadingChecklist(id);
    const profile = loadProfile();
    try {
      const res = await fetch("/api/checklist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile, scholarship: result.scholarship }) });
      const data = await res.json();
      setChecklists((prev) => ({ ...prev, [id]: data.checklist ?? [] }));
    } catch { setChecklists((prev) => ({ ...prev, [id]: [] })); }
    setLoadingChecklist(null);
  }

  function handleSave(result: MatchResult) {
    saveToTracker(result.scholarship.id, result.scholarship.deadline);
    setSaved((prev) => new Set(prev).add(result.scholarship.id));
  }

  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  const totalAmount = (results: MatchResult[]) => {
    const eligible = results.filter(r => r.eligible);
    return eligible.length;
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6 animate-bounce">🎓</div>
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
      <p className="text-gray-700 text-sm font-medium">AI is matching your profile to scholarships...</p>
      <p className="text-gray-400 text-xs mt-2">Analysing eligibility for each scholarship</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <Link href="/profile" className="text-blue-600 text-sm hover:underline">Go to profile</Link>
    </div>
  );

  const eligible = results.filter((r) => r.eligible);
  const notEligible = results.filter((r) => !r.eligible);
  const urgentCount = eligible.filter(r => { const d = daysUntil(r.scholarship.deadline); return d > 0 && d <= 30; }).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3" style={{animation:"float 3s ease-in-out infinite", display:"inline-block"}}>🎓</div>
        <h1 className="text-2xl font-semibold mb-1">Your scholarship matches</h1>
        <p className="text-gray-500 text-sm">AI found scholarships you actually qualify for</p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { n: eligible.length.toString(), l: "Matches found" },
            { n: urgentCount.toString(), l: "Closing soon" },
            { n: notEligible.length.toString(), l: "Not eligible" },
          ].map(item => (
            <div key={item.l} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-semibold text-blue-600">{item.n}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {eligible.map((result, i) => {
          const s = result.scholarship;
          const days = daysUntil(s.deadline);
          const isExpanded = expanded === s.id;
          const isSaved = saved.has(s.id);
          const isTopMatch = result.score >= 90;

          return (
            <div key={s.id}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border: isTopMatch ? "2px solid #2563eb" : "0.5px solid #e5e7eb",
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${result.score >= 80 ? "bg-green-50 text-green-700" : result.score >= 60 ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    <Sparkles size={10} /> {result.score}% match
                  </span>
                  {days > 0 && days <= 30 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                      <Clock size={10} /> {days} days left
                    </span>
                  )}
                  {days <= 0 && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Deadline passed</span>}
                  {isTopMatch && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600 text-white">Top match</span>}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-base leading-snug">{s.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{s.provider}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-semibold text-green-700">{s.amount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.deadline).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"})}
                    </p>
                  </div>
                </div>

                {days > 0 && (
                  <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-400" style={{width: `${Math.min(100, ((365 - days) / 365) * 100)}%`}} />
                  </div>
                )}

                <div className="flex items-start gap-2 mt-3 bg-blue-50 rounded-xl px-3 py-2.5">
                  <Bot size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">{result.reason}</p>
                </div>

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button onClick={() => handleSave(result)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${isSaved ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}>
                    {isSaved ? <CheckCircle size={12} /> : <Bookmark size={12} />}
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button onClick={() => toggleExpand(result)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">
                    Documents {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                <a href={s.link} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{background: isTopMatch ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "linear-gradient(135deg,#059669,#0891b2)"}}>
                  <ExternalLink size={14} />
                  Apply now on {s.provider} website
                  <ArrowRight size={14} />
                </a>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <p className="text-xs font-medium text-gray-700 mb-3">Documents you will need</p>
                  {loadingChecklist === s.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-gray-400">Generating your checklist...</p>
                    </div>
                  ) : checklists[s.id]?.length > 0 ? (
                    <div className="space-y-2">
                      {checklists[s.id].map((doc: any, i: number) => (
                        <div key={i} className={`flex gap-2.5 text-xs ${!doc.required ? "opacity-40" : ""}`}>
                          <div className={`mt-1 w-2 h-2 shrink-0 rounded-full ${doc.required ? "bg-blue-500" : "bg-gray-300"}`} />
                          <div>
                            <span className="font-medium text-gray-800">{doc.doc}</span>
                            <span className="text-gray-500"> — {doc.where}</span>
                            {doc.note && <p className="text-amber-600 mt-0.5">{doc.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-400">Could not load checklist.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {notEligible.length > 0 && (
        <details className="mt-6">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
            <ChevronDown size={14} /> Show {notEligible.length} you may not qualify for
          </summary>
          <div className="space-y-2 mt-3">
            {notEligible.map((result) => (
              <div key={result.scholarship.id} className="border border-gray-100 rounded-xl p-4 opacity-60">
                <h3 className="text-sm font-medium text-gray-500">{result.scholarship.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{result.reason}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="mt-8 text-center">
        <Link href="/tracker" className="text-sm text-blue-600 hover:underline">View saved scholarships in tracker</Link>
      </div>
    </div>
  );
}