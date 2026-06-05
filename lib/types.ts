export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  link: string;
  eligibility: {
    states: string[];
    categories: string[];
    maxIncome: number;
    minMarks: number;
    courses: string[];
    gender: string;
  };
  description: string;
  documents: string[];
}

export interface StudentProfile {
  name: string;
  state: string;
  category: string;
  annualIncome: number;
  marks: number;
  course: string;
  yearOfStudy: number;
  gender: string;
  isDisabled: boolean;
  isSportsPlayer: boolean;
}

export interface MatchResult {
  scholarship: Scholarship;
  score: number;
  reason: string;
  eligible: boolean;
  missingDocs: string[];
}

export type TrackerStatus = "saved" | "applied" | "submitted" | "result";

export interface TrackedScholarship {
  scholarshipId: string;
  status: TrackerStatus;
  notes: string;
  deadline: string;
  addedAt: string;
}