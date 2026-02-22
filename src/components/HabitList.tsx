"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, Edit2, Trash2, Bell, Tag } from "lucide-react";
import { Button } from "./ui/Button";

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
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => Promise<void>;
}

export default function HabitList({ habits, onTrack, onEdit, onDelete }: HabitListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");

  const handleTrack = async (id: string) => {
    setLoadingId(id);
    await onTrack(id);
    setLoadingId(null);
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center backdrop-blur-sm transition-colors duration-300 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
          <Check className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No habits yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Start building consistency today. Add your first habit and track your progress daily!
        </p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    Work: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
    Learning: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
    Mindfulness: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
    Fitness: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
    Finance: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const isCompletedToday = habit.logs.some((log) => log.date === today);
        const catColorClass = habit.category && categoryColors[habit.category] ? categoryColors[habit.category] : categoryColors["Other"];

        return (
          <div
            key={habit.id}
            className={`group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 shadow-sm transition-all duration-300 ${
              isCompletedToday
                ? "border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-900/80"
            }`}
          >
            <div className="flex items-start sm:items-center gap-4">
              <button
                onClick={() => handleTrack(habit.id)}
                disabled={loadingId === habit.id}
                className={`flex h-10 w-10 shrink-0 mt-1 sm:mt-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompletedToday
                    ? "border-violet-500 bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-transparent hover:border-violet-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                }`}
              >
                {loadingId === habit.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-slate-300" />
                ) : (
                  <Check className={`h-5 w-5 transition-opacity ${isCompletedToday ? "opacity-100" : "opacity-0 group-hover:opacity-50 text-violet-400"}`} />
                )}
              </button>
              
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className={`font-semibold tracking-tight transition-colors duration-300 ${isCompletedToday ? "text-violet-500 dark:text-violet-300 line-through decoration-violet-500/50" : "text-slate-800 dark:text-slate-200"}`}>
                    {habit.title}
                  </h3>
                  {habit.category && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${catColorClass}`}>
                      {habit.category}
                    </span>
                  )}
                  {habit.reminderTime && (
                    <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      <Bell className="w-3 h-3 mr-1" />
                      {habit.reminderTime}
                    </span>
                  )}
                </div>
                
                {habit.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300 line-clamp-2">{habit.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0 self-end sm:self-center opacity-100 sm:opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
              <Button variant="ghost" size="icon" onClick={() => onEdit(habit)} className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
