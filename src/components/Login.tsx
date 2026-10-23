import React, { useState } from 'react';
import { AUTHORIZED_USERS, getAuthorizedUser } from '../data/users';
import { CompanyUser } from '../types';
import { ShieldCheck, Mail, ArrowRight, AlertCircle, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: CompanyUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter your company email address');
      return;
    }

    if (!trimmedEmail.endsWith('@avaas.me')) {
      setError('Access restricted to official @avaas.me company accounts only.');
      return;
    }

    const user = getAuthorizedUser(trimmedEmail);
    if (!user) {
      setError(`Account "${trimmedEmail}" is not recognized in the AVAAS executive directory.`);
      return;
    }

    onLogin(user);
  };

  const handleSelectQuickUser = (user: CompanyUser) => {
    setEmail(user.email);
    setError(null);
    onLogin(user);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg z-10">
        {/* AVAAS Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Internal Executive Workspace
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2 font-sans flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
              AVAAS
            </span>
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Daily Standup, Meeting Logs & Attendance Portal for AVAAS Leadership
          </p>
        </div>

        {/* Login Box */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                A
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Employee Sign In</h2>
                <p className="text-xs text-slate-400">Enter your official @avaas.me mail</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Only
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Company Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. ceo@avaas.me"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Authorized: ceo@avaas.me, cto, coo, cfo, cmo, cpro
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-[0.99]"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Select Portal for fast testing */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Quick-Sign In (Authorized Executives)
              </span>
              <span className="text-[10px] text-slate-500">Click any profile</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AUTHORIZED_USERS.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleSelectQuickUser(user)}
                  className="group flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-slate-700 text-left transition-all"
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm`}
                  >
                    {user.initials}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 flex items-center gap-1 truncate">
                      {user.role}
                      {user.isCeo && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                          Host
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate font-mono">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Encrypted Session • AVAAS Enterprise Security</span>
        </div>
      </div>
    </div>
  );
};
