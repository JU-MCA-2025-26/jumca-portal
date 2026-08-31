export type DriveStatus = "ACTIVE" | "UPCOMING" | "CLOSED";
export type DriveSector = "ALL" | "SERVICE" | "PRODUCT" | "INTERNPPO";

export interface DriveCompany {
  id: string;
  name: string;
  sector: string | null;
  logoUrl: string | null;
  website: string | null;
}

export interface PlacementDriveSummary {
  id: string;
  company: DriveCompany;
  role: string;
  minCTC: string | null;
  maxCTC: string | null;
  minCGPA: number | null;
  driveDate: string | null;
  status: DriveStatus;
  sector: string | null;
}

export interface DriveResource {
  id: string;
  title: string;
  fileUrl: string;
  type: "OA_PAPER" | "INTERVIEW_NOTES" | "JD" | "RESUME_TIPS" | "OTHER";
  createdAt: string;
}

export interface PlacedAlumni {
  id: string;
  fullName: string;
  rollNumber: string;
  profile: { avatarUrl: string | null } | null;
  offer: { ctc: string; role: string; status: string };
}

export interface PlacementDriveDetail extends PlacementDriveSummary {
  jd: string | null;
  applyLink: string | null;
  description: string | null;
  resources: DriveResource[];
  placedAlumni: PlacedAlumni[];
}

export interface YearStat {
  year: number;
  placed: number;
  total: number;
}

export interface SalaryBand {
  label: string; // "6-10", "10-15", "15-20", "20-30", "30+"
  count: number;
}

export interface PlacementStats {
  companiesCount: number;
  offersCount: number;
  eligibleCount: number;
  highestCTC: string;
  highestCTCSource: string; // "Google — SWE"
  averageCTC: string;
  yearlyStats: YearStat[];
  salaryBands: SalaryBand[];
}
