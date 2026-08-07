export type Status = "applied" | "oa" | "interview" | "offer" | "rejected";

export interface Application {
  id: number;
  company: string;
  role: string;
  jd_text: string;
  status: Status;
  date_applied: string;
  last_status_change: string;
}

export interface ApplicationWithGap extends Application {
  missing_skills_count: number;
}

export interface ApplicationDetail extends Application {
  matched_skills: string[];
  missing_skills: string[];
}

export interface Skill {
  id: number;
  name: string;
}

export interface DashboardRow {
  name: string;
  missing_count: number;
}
