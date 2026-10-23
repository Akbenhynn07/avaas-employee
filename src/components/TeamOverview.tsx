import React, { useState } from 'react';
import { AUTHORIZED_USERS } from '../data/users';
import { CompanyUser, AttendanceEntry } from '../types';
import {
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  Flame,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Download,
  Filter,
} from 'lucide-react';

interface TeamOverviewProps {
  currentUser: CompanyUser;
  entries: AttendanceEntry[];
  selectedDate: string;
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({
  currentUser,
  entries,
  selectedDate,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');

  // Filter entries for the selected date
  const dateEntries = entries.filter((e) => e.date === selectedDate);

  // Map users with their attendance state for today
  const teamStatusList = AUTHORIZED_USERS.map((member) => {
    const entry = dateEntries.find(
      (e) => e.userEmail.toLowerCase() === member.email.toLowerCase()
    );
    return {
      user: member,
      entry: entry,
      hasCheckedIn: !!entry,
    };
  });

  const checkedInCount = teamStatusList.filter((m) => m.hasCheckedIn).length;
  const totalCount = AUTHORIZED_USERS.length;
  const attendancePercentage = Math.round((checkedInCount / totalCount) * 100);

  const filteredMembers = teamStatusList.filter((item) => {
    if (filterRole === 'all') return true;
    if (filterRole === 'checked_in') return item.hasCheckedIn;
    if (filterRole === 'pending') return !item.hasCheckedIn;
    return true;
  });

  const copyDailyReport = () => {
    const lines = [
      `AVAAS Executive Daily Standup Summary`,
      `Date: ${selectedDate}`,
      `Attendance: ${checkedInCount}/${totalCount} executives checked in (${attendancePercentage}%)`,
      `----------------------------------------`,
      ...teamStatusList.map((m) => {
        if (!m.hasCheckedIn) {
          return `\n[ ] ${m.user.role} (${m.user.email}) - PENDING ATTENDANCE`;
        }
        return `\n[✓] ${m.user.role} (${m.user.email})
  • Meeting Duration: ${m.entry?.meetingDuration}
  • Work Done: ${m.entry?.workDone}
  • Tomorrow: ${m.entry?.planTomorrow}`;
      }),
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dateEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `avaas_standup_${selectedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Attendance Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today's Attendance
            </span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              {attendancePercentage}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{checkedInCount}</span>
            <span className="text-slate-400 text-sm font-medium">/ {totalCount} Executives Marked</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Company Roster */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Authorized Team
            </span>
            <span className="text-xs text-slate-400 font-mono">@avaas.me</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalCount}</span>
            <span className="text-slate-400 text-sm font-medium">C-Level Leadership</span>
          </div>
          <div className="flex -space-x-2 mt-3 overflow-hidden">
            {AUTHORIZED_USERS.map((u) => (
              <div
                key={u.email}
                title={`${u.role} (${u.email})`}
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${u.avatarColor} border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold shadow-sm`}
              >
                {u.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Action & Export */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Executive Actions
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Copy formatted team standup summary for leadership sync.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={copyDailyReport}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
            <button
              onClick={downloadJson}
              title="Download JSON data"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Board List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Leadership Daily Standup Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time attendance & task reporting for all 6 company accounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Members ({totalCount})</option>
              <option value="checked_in">Checked In ({checkedInCount})</option>
              <option value="pending">Pending ({totalCount - checkedInCount})</option>
            </select>
          </div>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map(({ user, entry, hasCheckedIn }) => (
            <div
              key={user.email}
              className={`rounded-2xl p-5 border transition-all ${
                hasCheckedIn
                  ? 'bg-slate-900/70 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-900/30 border-dashed border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{user.role}</span>
                      <span className="text-[11px] text-slate-400">({user.title})</span>
                      {user.isCeo && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-semibold">
                          CEO
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">{user.email}</span>
                  </div>
                </div>

                {hasCheckedIn ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Present
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>

              {hasCheckedIn && entry ? (
                <div className="mt-4 pt-3 border-t border-slate-800/70 space-y-3">
                  {/* Meeting Duration */}
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="text-slate-400 font-medium">Meeting Call Duration:</span>
                    <span className="text-white font-semibold font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                      {entry.meetingDuration}
                    </span>
                  </div>

                  {/* Work Done */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                      <Briefcase className="w-3 h-3 text-indigo-400" />
                      <span>Work Completed Today:</span>
                    </div>
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-indigo-500/40">
                      {entry.workDone}
                    </p>
                  </div>

                  {/* Plan Tomorrow */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Tomorrow's Roadmap:</span>
                    </div>
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-amber-500/40">
                      {entry.planTomorrow}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 text-right pt-1">
                    Logged for {entry.formattedDate}
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-slate-800/40 text-center py-4">
                  <p className="text-xs text-slate-500 italic">
                    Has not submitted meeting call duration or standup for today yet.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
