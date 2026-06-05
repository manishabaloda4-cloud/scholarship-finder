import { StudentProfile, TrackedScholarship, TrackerStatus } from "./types";

const PROFILE_KEY = "sf_profile";
const TRACKER_KEY = "sf_tracker";

export function saveProfile(profile: StudentProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function loadTracker(): TrackedScholarship[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TRACKER_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveToTracker(scholarshipId: string, deadline: string) {
  const tracker = loadTracker();
  if (tracker.find((t) => t.scholarshipId === scholarshipId)) return;
  tracker.push({ scholarshipId, status: "saved", notes: "", deadline, addedAt: new Date().toISOString() });
  localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
}

export function updateTrackerStatus(scholarshipId: string, status: TrackerStatus) {
  const tracker = loadTracker();
  const item = tracker.find((t) => t.scholarshipId === scholarshipId);
  if (item) { item.status = status; localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker)); }
}