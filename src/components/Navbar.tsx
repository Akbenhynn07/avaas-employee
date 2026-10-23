import React from 'react';
import { CompanyUser } from '../types';
import { LogOut, Calendar, Shield, Users, Clock } from 'lucide-react';

interface NavbarProps {
  user: CompanyUser;
  onLogout: () => void;
  activeTab: 'standup' | 'team' | 'history';
  setActiveTab: (tab: 'standup' | 'team' | 'history') => void;
  checkedInToday: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab,
  checkedInToday,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/25">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  AVAAS
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-blue-400 -mt-1">
                  Employee Dashboard
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              <button
                onClick={() => setActiveTab('standup')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'standup'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Daily Standup</span>
                {checkedInToday && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'team'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Executive Board</span>
                {user.isCeo && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                    CEO View
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Header Status & Profile */}
          <div className="flex items-center gap-3">
            {/* Today Date Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">{todayFormatted}</span>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800">
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
              >
                {user.initials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">{user.role}</span>
                  {user.isCeo && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-semibold">
                      Host
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400">{user.email}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Sign out or switch user"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-slate-800/60 py-2 gap-2">
          <button
            onClick={() => setActiveTab('standup')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium text-center ${
              activeTab === 'standup'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            Daily Standup
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium text-center ${
              activeTab === 'team'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            Executive Board
          </button>
        </div>
      </div>
    </header>
  );
};
