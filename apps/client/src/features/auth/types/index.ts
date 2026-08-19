export interface LoginPayload {
  identifier: string; // roll number or email
  password: string;
}

export interface UserProfile {
  id: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  github: string | null;
  linkedin: string | null;
  leetcode: string | null;
  gfg: string | null;
  codeforces: string | null;
  portfolio: string | null;
  currentCompany: string | null;
  designation: string | null;
}

export interface AuthUser {
  id: string;
  rollNumber: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "STUDENT" | "ALUMNI";
  isActive: boolean;
  batch: string; // null for ADMIN accounts
  profile: UserProfile | null;
  createdAt: string;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface MeApiResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}
