export type DashboardMember = {
  name: string;
  avatar: string;
  github: string;
  active: boolean;
  birthday?: string;
  welcome_messages?: string[];
};

export type DashboardOfficeTimes = {
  github_name: string;
  total_time: number;
  last_seen: string | undefined;
  current_session_duration: number;
  is_active: 1 | 0;
};

export type DashboardApiResponse = {
  members: DashboardMember[];
  office_times: DashboardOfficeTimes[];
  [key: string]: unknown;
};

export type MemberWithWorkingStats = {
  name: string;
  avatar: string;
  github: string;
  isWebkomActive: boolean;
  isPresent: boolean;
  isOfficeTimeLeader: boolean;
  lastSeen?: string;
  sessionDurationFormatted: string;
  totalHoursFormatted: string;
  totalSeconds: number;
};
