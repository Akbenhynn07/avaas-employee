import React, { useState, useEffect } from 'react';
import { CompanyUser, AttendanceEntry } from '../types';
import confetti from 'canvas-confetti';
import {
  Clock,
  Briefcase,
  CalendarCheck,
  Send,
  CheckCircle2,
  Sparkles,
  Flame,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface AttendanceFormProps {
  user: CompanyUser;
  onSaveEntry: (entry: AttendanceEntry) => void;
  existingEntryForToday?: AttendanceEntry;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  user,
  onSaveEntry,
  existingEntryForToday,
}) => {
  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const formatDisplayDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  const [meetingDuration, setMeetingDuration] = useState<string>('45 minutes');
  const [customDuration, setCustomDuration] = useState<string>('');
  const [workDone, setWorkDone] = useState<string>('');
  const [planTomorrow, setPlanTomorrow] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick duration presets
  const durationPresets = ['15 mins', '30 mins', '45 mins', '60 mins', '90 mins', 'Custom'];

  // Populate if already logged for the date
  useEffect(() => {
    if (existingEntryForToday) {
      setWorkDone(existingEntryForToday.workDone);
      setPlanTomorrow(existingEntryForToday.planTomorrow);
      if (durationPresets.includes(existingEntryForToday.meetingDuration)) {
        setMeetingDuration(existingEntryForToday.meetingDuration);
      } else {
        setMeetingDuration('Custom');
        setCustomDuration(existingEntryForToday.meetingDuration);
      }
      setSubmittedMessage(`Attendance marked for ${existingEntryForToday.formattedDate} date`);
    } else {
      setSubmittedMessage(null);
    }
  }, [existingEntryForToday]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#818cf8', '#34d399', '#fbbf24'],
      });
    } catch {
      // ignore if confetti fails
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const effectiveDuration =
      meetingDuration === 'Custom' ? customDuration.trim() : meetingDuration;

    if (!effectiveDuration) {
      setErrorMessage('Please specify the duration of your call in the meeting.');
      return;
    }

    if (!workDone.trim()) {
      setErrorMessage('Please describe what work you did today.');
      return;
    }

    if (!planTomorrow.trim()) {
      setErrorMessage('Please outline what you are doing tomorrow.');
      return;
    }

    setIsSubmitting(true);

    const formattedDate = formatDisplayDate(selectedDate);
    const newEntry: AttendanceEntry = {
      id: `${user.email}_${selectedDate}`,
      userEmail: user.email,
      userName: user.role,
      roleTitle: user.title,
      date: selectedDate,
      formattedDate: formattedDate,
      meetingDuration: effectiveDuration,
      workDone: workDone.trim(),
      planTomorrow: planTomorrow.trim(),
      timestamp: Date.now(),
    };

    setTimeout(() => {
      onSaveEntry(newEntry);
      setIsSubmitting(false);
      const confirmationText = `Attendance marked for ${formattedDate} date`;
      setSubmittedMessage(confirmationText);
      triggerConfetti();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Widget: Welcome & Quick Status */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Check-in
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                {user.role}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Log your daily meeting duration, achievements, and roadmap for tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}
              >
                {user.initials}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">{user.title}</div>
                <div className="text-[11px] font-mono text-slate-400">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Attendance Confirmation Banner if marked */}
      {submittedMessage && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-900 border border-emerald-500/40 text-emerald-200 shadow-xl shadow-emerald-950/40 relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Status: Present & Logged
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {submittedMessage}
                </h3>
                <p className="text-xs text-emerald-300/80">
                  Your work standup and meeting minutes have been synced to the AVAAS leadership log.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setSubmittedMessage(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 transition"
              >
                Edit entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Interface Widget */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800/90">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Daily Standup & Attendance Form</h2>
              <p className="text-xs text-slate-400">
                Complete all three fields below and submit to mark attendance
              </p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field 1: Duration of your call in the meeting */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>1. Duration of your call in the meeting</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Selected: <span className="text-blue-400 font-bold">{meetingDuration === 'Custom' ? (customDuration || 'Custom') : meetingDuration}</span>
              </span>
            </div>

            {/* Quick chips selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {durationPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setMeetingDuration(preset);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center border ${
                    meetingDuration === preset
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 ring-2 ring-blue-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom duration text input if selected */}
            {meetingDuration === 'Custom' && (
              <div className="pt-2">
                <input
                  type="text"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="e.g. 1 hour 20 minutes or 40 mins"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
          </div>

          {/* Field 2: What work did you do? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>2. What work did you do?</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {workDone.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={workDone}
              onChange={(e) => {
                setWorkDone(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Detail the tasks, commits, meetings, strategic decisions, or milestones accomplished today..."
              className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
            />
          </div>

          {/* Field 3: What are you doing tomorrow? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>3. What are you doing tomorrow?</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {planTomorrow.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={planTomorrow}
              onChange={(e) => {
                setPlanTomorrow(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Key focus areas, pending reviews, scheduled calls, deliverable deadlines for tomorrow..."
              className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 order-2 sm:order-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Attendance confirmation will be displayed immediately upon submission.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-50 order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Marking Attendance...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit & Mark Attendance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
