"use client";

import { format } from "date-fns";
import { Check } from "lucide-react";
import HabitItem from "./dashboard/HabitItem";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  reminderTime: string | null;
  logs: { id: string; date: string }[];
}

interface HabitListProps {
  habits: Habit[];
  onTrack: (habitId: string) => Promise<void>;
  onTrackRequest: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => Promise<void>;
}

export default function HabitList({ habits, onTrack, onTrackRequest, onEdit, onDelete }: HabitListProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-center backdrop-blur-xl transition-colors duration-300 animate-in fade-in zoom-in-95 duration-500 shadow-inner">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center group">
          <div className="absolute inset-0 rounded-full bg-violet-100 dark:bg-violet-900/40 animate-ping opacity-75 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/60 transition-colors duration-500" style={{ animationDuration: '3s' }}></div>
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/50 dark:to-fuchsia-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10 border border-violet-200 dark:border-violet-800/50 group-hover:scale-105 transition-transform duration-500">
            <Check className="w-10 h-10 opacity-70" />
          </div>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">No habits yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Start building consistency today. Add your first habit and track your progress daily!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit, index) => {
        const isCompletedToday = habit.logs.some((log) => log.date === today);

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            isCompletedToday={isCompletedToday}
            onTrack={onTrack}
            onTrackRequest={onTrackRequest}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        );
      })}
    </div>
  );
}
