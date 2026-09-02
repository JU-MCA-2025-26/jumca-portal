import type { ConnectRequestStatus } from "./ConnectionRequestStatus.ts";

export interface AlumniParams {
  id: string;
}

export interface ConnectRequestParams {
  id: string;
}

export interface AlumniListItem {
  id: string;
  fullName: string;
  batch: string;
  graduationYear: number | null;
  avatarUrl: string | null;
  company: string | null;
  jobRole: string | null;
  location: string | null;
  tags: string[];
  openToConnect: boolean;
}

export interface AlumniProfile extends AlumniListItem {
  rollNumber: string;
  bio: string | null;
  github: string | null;
  leetcode: string | null;
  gfg: string | null;
  codeforces: string | null;
  linkedinUrl: string | null;
}

export interface ConnectRequestUser {
  id: string;
  fullName: string;
  batch: string;
  avatarUrl: string | null;
}

export interface ConnectRequest {
  id: string;
  message: string | null;
  status: ConnectRequestStatus;
  createdAt: string;
  requester: ConnectRequestUser;
  alumni: ConnectRequestUser;
}

export interface GetAlumniListResponse {
  success: boolean;
  data: {
    data: AlumniListItem[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetGraduationYearsResponse {
  success: boolean;
  data: number[];
}

export interface GetAlumniProfileResponse {
  success: boolean;
  data: AlumniProfile;
}

export interface SendConnectRequestResponse {
  success: boolean;
  message: string;
  data: ConnectRequest;
}

export interface GetConnectRequestsResponse {
  success: boolean;
  data: ConnectRequest[];
}

export interface RespondConnectRequestResponse {
  success: boolean;
  message: string;
  data: ConnectRequest;
}
