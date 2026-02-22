"use client";

import { useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import HabitList from "@/components/HabitList";
import HabitModal from "@/components/HabitModal";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";

import NoteModal from "@/components/NoteModal";

export default function DashboardPage() {
  const { habits, stats, isLoading, mutateHabits, mutateStats } = useDashboardData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [habitToTrack, setHabitToTrack] = useState<any>(null);

  const handleTrack = async (habitId: string, note?: string) => {
    // Optimistic UI update logic could go here before the fetch
    const today = new Date().toISOString().split("T")[0];
    
    // Quick optimistic update for the habit we just tracked
    mutateHabits(
      (currentHabits: any) => currentHabits?.map((h: any) => 
        h.id === habitId ? { ...h, logs: [...h.logs, { id: 'temp', date: today, note }] } : h
      ), 
      false // don't revalidate immediately, wait for the post request
    );

    try {
      await fetch(`/api/habits/${habitId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, note }),
      });
      // Re-fetch both habits and stats to ensure everything is perfectly synced
      mutateHabits();
      mutateStats();
    } catch (error) {
      console.error("Failed to track habit", error);
      mutateHabits(); // Revert optimistic update on failure
    }
  };

  const handleSaveHabit = async (data: { title: string; description: string; category: string; reminderTime: string }) => {
    try {
      const url = editingHabit ? `/api/habits/${editingHabit.id}` : "/api/habits";
      const method = editingHabit ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      mutateHabits();
      mutateStats();
    } catch (error) {
      console.error("Failed to save habit", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setDeletingHabitId(habitId);
  };

  const confirmDelete = async () => {
    if (!deletingHabitId) return;
    
    // Optimistic removal
    mutateHabits((current: any) => current?.filter((h: any) => h.id !== deletingHabitId), false);
    
    try {
      await fetch(`/api/habits/${deletingHabitId}`, { method: "DELETE" });
      mutateHabits();
      mutateStats();
    } catch (error) {
      mutateHabits(); // Revert
    } finally {
      setDeletingHabitId(null);
    }
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: any) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200/50 dark:border-slate-800/50 border-t-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Mesh Effect */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-violet-500/10 dark:bg-violet-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[40%] left-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-10 relative z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 transition-colors duration-300">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium transition-colors duration-300">
              Master your routines, track your daily goals.
            </p>
          </div>
          <Button 
            onClick={openCreateModal} 
            className="group relative overflow-hidden bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl px-6"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> 
            <span className="font-semibold tracking-wide">New Habit</span>
          </Button>
        </div>

        <DashboardStats stats={stats} />

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300">Your Habits</h2>
          </div>
          <HabitList 
            habits={habits} 
            onTrack={handleTrack} 
            onTrackRequest={setHabitToTrack}
            onEdit={openEditModal}
            onDelete={handleDeleteHabit}
          />
        </div>

        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          initialData={editingHabit}
        />

        <NoteModal
          isOpen={!!habitToTrack}
          habitName={habitToTrack?.title || ""}
          onClose={() => setHabitToTrack(null)}
          onSubmit={(note) => {
            if (habitToTrack) {
              handleTrack(habitToTrack.id, note);
              setHabitToTrack(null);
            }
          }}
        />

        {/* Custom Delete Confirmation Modal using Framer Motion */}
        {deletingHabitId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md p-4 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-[24px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_0_40px_rgba(239,68,68,0.15)] dark:shadow-[0_0_40px_rgba(239,68,68,0.2)] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Delete Habit?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete this habit? All history and tracked days will be permanently lost.
              </p>
              <div className="flex justify-center gap-4 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setDeletingHabitId(null)}
                  className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:-translate-y-0.5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
