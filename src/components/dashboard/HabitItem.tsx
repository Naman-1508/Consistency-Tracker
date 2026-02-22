"use client";

import { useState } from "react";
import { Check, Edit2, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  reminderTime: string | null;
  logs: { id: string; date: string }[];
}

interface HabitItemProps {
  habit: Habit;
  isCompletedToday: boolean;
  onTrack: (habitId: string) => Promise<void>;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  Work: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  Learning: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
  Mindfulness: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
  Fitness: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
  Finance: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export default function HabitItem({ habit, isCompletedToday, onTrack, onEdit, onDelete, index }: HabitItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    setIsLoading(true);
    await onTrack(habit.id);
    setIsLoading(false);
  };

  const catColorClass = habit.category && CATEGORY_COLORS[habit.category] 
    ? CATEGORY_COLORS[habit.category] 
    : CATEGORY_COLORS["Other"];

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 transition-all duration-400 animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${
        isCompletedToday
          ? "border-violet-500/40 bg-violet-50/80 dark:bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          : "border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start sm:items-center gap-4">
        <button
          onClick={handleTrack}
          disabled={isLoading}
          className={`flex h-11 w-11 shrink-0 mt-1 sm:mt-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            isCompletedToday
              ? "border-violet-500 bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-100"
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-transparent hover:border-violet-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 hover:scale-105"
          }`}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Check className={`h-5 w-5 transition-all duration-500 ${isCompletedToday ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-100 text-violet-400"}`} />
          )}
        </button>
        
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`font-semibold tracking-tight transition-all duration-300 text-lg ${
              isCompletedToday 
                ? "text-violet-600 dark:text-violet-300 decoration-violet-500/50" 
                : "text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white"
            }`}>
              {habit.title}
            </h3>
            {habit.category && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${catColorClass}`}>
                {habit.category}
              </span>
            )}
            {habit.reminderTime && (
              <span className="inline-flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm">
                <Bell className="w-3 h-3 mr-1" />
                {habit.reminderTime}
              </span>
            )}
          </div>
          
          {habit.description && (
            <p className="text-sm text-slate-500/90 dark:text-slate-400/90 transition-colors duration-300 line-clamp-2 pr-8 sm:pr-0">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 sm:mt-0 self-end sm:self-center opacity-100 sm:opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(habit)} 
          className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
          title="Edit Habit"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(habit.id)} 
          className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent rounded-full transition-colors"
          title="Delete Habit"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
