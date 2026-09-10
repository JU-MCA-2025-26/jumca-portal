import type { Role } from "./Role.js";
import type { ApiResponse } from "./ApiResponse.js";
import type { SemesterTermType } from "./Course.js";

export interface PublicUser {
  id: string;
  rollNumber: string;
  email: string;
  fullName: string;
  role: Role;
  batch: string;
  currentYear: number | null;
  currentSemester: SemesterTermType | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  accessToken: string;
  user: PublicUser;
}

export interface UserData {
  user: PublicUser;
}

export type LoginResponse = ApiResponse<LoginData>;
export type CreateUserResponse = ApiResponse<UserData>;
export type GetMeResponse = ApiResponse<UserData>;
