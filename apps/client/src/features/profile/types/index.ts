// Current semester course row
export interface SemesterCourse {
  code: string;
  name: string;
  credits: number;
  grade: string;
  attendance: number; // 0–100
}

// Placement status
export type PlacementStatus = "ELIGIBLE" | "NOT_ELIGIBLE" | "PLACED";

// Social platform link
export interface SocialLink {
  platform: "github" | "linkedin" | "leetcode" | "gfg" | "codeforces" | "portfolio";
  label: string;
  url: string;
}
