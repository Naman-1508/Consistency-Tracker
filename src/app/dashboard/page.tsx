"use client";

import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import HabitList from "@/components/HabitList";
import HabitModal from "@/components/HabitModal";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        fetch("/api/habits"),
        fetch("/api/dashboard")
      ]);
      const [habitsData, statsData] = await Promise.all([
        habitsRes.json(),
        statsRes.json()
      ]);
      setHabits(habitsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrack = async (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch(`/api/habits/${habitId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to track habit", error);
    }
  };

  const handleSaveHabit = async (data: { title: string; description: string; category: string; reminderTime: string }) => {
    try {
      const url = editingHabit ? `/api/habits/${editingHabit.id}` : "/api/habits";
      const method = editingHabit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to save habit", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setDeletingHabitId(habitId);
  };

  const confirmDelete = async () => {
    if (!deletingHabitId) return;
    
    try {
      const res = await fetch(`/api/habits/${deletingHabitId}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      // Intentionally suppressing console out for deletions per user request
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading consistency data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">Track and manage your daily goals.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25 transition-all">
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-2 rounded-full bg-violet-600"></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Your Habits</h2>
        </div>
        <HabitList 
          habits={habits} 
          onTrack={handleTrack} 
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

      {/* Custom Delete Confirmation Modal */}
      {deletingHabitId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 text-center animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(239,68,68,0.05)] dark:shadow-[0_0_40px_rgba(239,68,68,0.1)] p-6 relative transition-colors duration-300 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Habit?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this habit? All history and tracked days will be permanently lost.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={() => setDeletingHabitId(null)}
                className="flex-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
