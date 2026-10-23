import React, { useState, useEffect } from 'react';
import { CompanyUser, AttendanceEntry } from './types';
import { AUTHORIZED_USERS } from './data/users';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { AttendanceForm } from './components/AttendanceForm';
import { TeamOverview } from './components/TeamOverview';
import { Users, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

const STORAGE_KEY_USER = 'avaas_active_user';
const STORAGE_KEY_ENTRIES = 'avaas_attendance_entries_v1';

// Initial preloaded data for demo purposes so the board has rich context
const getInitialEntries = (): AttendanceEntry[] => {
  const todayISO = new Date().toISOString().split('T')[0];
  const [y, m, d] = todayISO.split('-').map(Number);
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));

  return [
    {
      id: `cto@avaas.me_${todayISO}`,
      userEmail: 'cto@avaas.me',
      userName: 'CTO',
      roleTitle: 'Chief Technology Officer',
      date: todayISO,
      formattedDate: formattedToday,
      meetingDuration: '45 mins',
      workDone: 'Finalized system architecture for real-time dashboard microservices. Reviewed 4 PRs on backend authentication security.',
      planTomorrow: 'Deploy CI/CD pipeline automation and conduct database stress testing for scale.',
      timestamp: Date.now() - 3600000 * 3,
    },
    {
      id: `coo@avaas.me_${todayISO}`,
      userEmail: 'coo@avaas.me',
      userName: 'COO',
      roleTitle: 'Chief Operating Officer',
      date: todayISO,
      formattedDate: formattedToday,
      meetingDuration: '60 mins',
      workDone: 'Aligned quarterly sprint objectives with engineering leads and finalized Q4 resource allocation schedule.',
      planTomorrow: 'Review cross-department operational SLA metrics and prepare monthly town hall presentation.',
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: `cfo@avaas.me_${todayISO}`,
      userEmail: 'cfo@avaas.me',
      userName: 'CFO',
      roleTitle: 'Chief Financial Officer',
      date: todayISO,
      formattedDate: formattedToday,
      meetingDuration: '30 mins',
      workDone: 'Completed fiscal audit reconciliation and reviewed departmental software subscriptions for budget optimization.',
      planTomorrow: 'Draft updated financial forecast models for the upcoming board investor review.',
      timestamp: Date.now() - 3600000 * 1,
    },
  ];
};

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CompanyUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to CEO user for immediate preview
    return AUTHORIZED_USERS[0];
  });

  const [entries, setEntries] = useState<AttendanceEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialEntries();
      }
    }
    return getInitialEntries();
  });

  const [activeTab, setActiveTab] = useState<'standup' | 'team' | 'history'>('standup');
  const todayISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  }, [entries]);

  const handleLogin = (user: CompanyUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSaveEntry = (newEntry: AttendanceEntry) => {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.id !== newEntry.id);
      return [newEntry, ...filtered];
    });
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const existingEntryForToday = entries.find(
    (e) =>
      e.userEmail.toLowerCase() === currentUser.email.toLowerCase() &&
      e.date === todayISO
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        checkedInToday={!!existingEntryForToday}
      />

      {/* Quick Executive Switcher Toolbar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Viewing as:
            </span>
            <span className="text-white font-bold">{currentUser.role}</span>
            <span className="text-slate-500 font-mono">({currentUser.email})</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] text-slate-500 hidden sm:inline mr-1">Switch:</span>
            {AUTHORIZED_USERS.map((u) => {
              const isSelected = u.email === currentUser.email;
              const hasCheckedIn = entries.some(
                (e) => e.userEmail.toLowerCase() === u.email.toLowerCase() && e.date === todayISO
              );
              return (
                <button
                  key={u.email}
                  onClick={() => setCurrentUser(u)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>{u.role}</span>
                  {hasCheckedIn && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'standup' ? (
          <div className="max-w-3xl mx-auto">
            <AttendanceForm
              user={currentUser}
              onSaveEntry={handleSaveEntry}
              existingEntryForToday={existingEntryForToday}
            />
          </div>
        ) : (
          <TeamOverview
            currentUser={currentUser}
            entries={entries}
            selectedDate={todayISO}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AVAAS</span>
            <span>• Corporate Attendance & Daily Standup Suite</span>
          </div>
          <div>
            Authorized Executives: ceo@avaas.me, cpro, cmo, cfo, coo, cto
          </div>
        </div>
      </footer>
    </div>
  );
};
