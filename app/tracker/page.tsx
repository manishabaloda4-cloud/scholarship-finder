"use client";
import { useEffect, useState } from "react";
import { loadTracker, updateTrackerStatus } from "@/lib/storage";
import { TrackedScholarship, TrackerStatus } from "@/lib/types";
import scholarships from "@/data/scholarships.json";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
const COLS: { key: TrackerStatus; label: string; bg: string; dot: string }[] = [
  { key: "saved", label: "Saved", bg: "bg-gray-50", dot: "bg-gray-400" },
  { key: "applied", label: "Applied", bg: "bg-blue-50", dot: "bg-blue-500" },
  { key: "submitted", label: "Docs submitted", bg: "bg-amber-50", dot: "bg-amber-500" },
  { key: "result", label: "Result awaited", bg: "bg-green-50", dot: "bg-green-500" },
];
export default function TrackerPage() {
  const [tracker, setTracker] = useState<TrackedScholarship[]>([]);
  useEffect(() => { setTracker(loadTracker()); }, []);
  function move(id: string, status: TrackerStatus) { updateTrackerStatus(id, status); setTracker(loadTracker()); }
  const getS = (id: string) => scholarships.find((s) => s.id === id);
  const days = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (tracker.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-4xl mb-4">📋</p>
      <p className="text-gray-600 font-medium mb-2">No scholarships saved yet</p>
      <p className="text-gray-400 text-sm mb-6">Find matches and save them to track here.</p>
      <Link href="/results" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">Find scholarships</Link>
    </div>
  );
  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Application tracker</h1>
      <p className="text-gray-500 text-sm mb-8">{tracker.length} scholarship{tracker.length !== 1 ? "s" : ""} saved</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLS.map((col) => {
          const items = tracker.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className={`rounded-2xl p-4 min-h-40 ${col.bg}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <p className="text-xs font-medium text-gray-600">{col.label} <span className="text-gray-400">({items.length})</span></p>
              </div>
              <div className="space-y-2">
                {items.map((t) => {
                  const s = getS(t.scholarshipId);
                  if (!s) return null;
                  const d = days(t.deadline);
                  return (
                    <div key={t.scholarshipId} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <p className="text-xs font-medium leading-snug text-gray-800">{s.name}</p>
                      <p className="text-xs text-green-700 font-medium mt-0.5">{s.amount}</p>
                      {d > 0 ? <p className={`text-xs mt-1 ${d<=7?"text-red-500 font-medium":d<=30?"text-amber-600":"text-gray-400"}`}>{d} days left</p>
                             : <p className="text-xs mt-1 text-gray-300">Deadline passed</p>}
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink size={11} /></a>
                        {COLS.filter((c) => c.key !== col.key).map((c) => (
                          <button key={c.key} onClick={() => move(t.scholarshipId, c.key)}
                            className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors">
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}