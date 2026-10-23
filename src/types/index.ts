export interface CompanyUser {
  email: string;
  role: string;
  title: string;
  department: string;
  avatarColor: string;
  initials: string;
  isCeo?: boolean;
}

export interface AttendanceEntry {
  id: string;
  userEmail: string;
  userName: string;
  roleTitle: string;
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "October 23, 2026"
  meetingDuration: string; // e.g. "45 minutes" or "1 hour"
  workDone: string;
  planTomorrow: string;
  timestamp: number;
}
