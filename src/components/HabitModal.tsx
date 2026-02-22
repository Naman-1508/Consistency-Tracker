import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: { title: string; description: string; category: string; reminderTime: string }) => Promise<void>;
  initialData?: { title: string; description: string | null; category?: string | null; reminderTime?: string | null } | null;
}

const CATEGORIES = ["Health", "Work", "Learning", "Mindfulness", "Fitness", "Finance", "Other"];

export default function HabitModal({ isOpen, onClose, onSave, initialData }: HabitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  
  const [hasReminder, setHasReminder] = useState(false);
  const [remHour, setRemHour] = useState("09");
  const [remMin, setRemMin] = useState("00");
  const [remAmPm, setRemAmPm] = useState("AM");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setCategory(initialData?.category || "Other");
      
      if (initialData?.reminderTime) {
        setHasReminder(true);
        const [h, m] = initialData.reminderTime.split(":");
        let hourInt = parseInt(h, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        if (hourInt === 0) hourInt = 12;
        else if (hourInt > 12) hourInt -= 12;
        
        setRemHour(hourInt.toString().padStart(2, "0"));
        setRemMin(m);
        setRemAmPm(ampm);
      } else {
        setHasReminder(false);
        setRemHour("09");
        setRemMin("00");
        setRemAmPm("AM");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let finalReminderTime = "";
    if (hasReminder) {
      let h = parseInt(remHour, 10);
      if (remAmPm === "PM" && h < 12) h += 12;
      if (remAmPm === "AM" && h === 12) h = 0;
      finalReminderTime = `${h.toString().padStart(2, '0')}:${remMin}`;
    }
    
    await onSave({ title, description, category, reminderTime: finalReminderTime });
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.1)] dark:shadow-[0_0_40px_rgba(139,92,246,0.2)] p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 opacity-70 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-100 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:rotate-90"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <h2 className="text-2xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              {initialData ? "Edit Habit" : "Create New Habit"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="title">
                  Habit Name
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Read 10 pages, Workout, Drink Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-950/50 text-slate-900 dark:text-slate-200 transition-all duration-300"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="hasReminder">
                    Set Daily Reminder
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={hasReminder} onChange={(e) => setHasReminder(e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-violet-600"></div>
                  </label>
                </div>
                
                <AnimatePresence>
                  {hasReminder && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 overflow-hidden"
                    >
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-violet-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <select 
                          value={remHour} 
                          onChange={e => setRemHour(e.target.value)} 
                          className="pl-9 flex h-11 w-full rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200"
                        >
                          {Array.from({length: 12}).map((_, i) => {
                            const val = (i + 1).toString().padStart(2, '0');
                            return <option key={val} value={val}>{val}</option>;
                          })}
                        </select>
                      </div>
                      <span className="text-slate-400 font-bold">:</span>
                      <select 
                        value={remMin} 
                        onChange={e => setRemMin(e.target.value)} 
                        className="flex h-11 w-20 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200"
                      >
                        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        value={remAmPm} 
                        onChange={e => setRemAmPm(e.target.value)} 
                        className="flex h-11 w-20 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="description">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input
                  id="description"
                  placeholder="e.g., Read a non-fiction book before bed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all duration-300"
                />
              </div>
              
              <div className="pt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-6">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg shadow-violet-500/30 px-6 transition-all hover:-translate-y-0.5" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : "Save Habit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
