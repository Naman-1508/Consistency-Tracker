import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { X } from "lucide-react";

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md p-4 text-left animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.05)] dark:shadow-[0_0_40px_rgba(139,92,246,0.1)] p-6 relative transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-100 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <h2 className="text-xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white transition-colors duration-300">
          {initialData ? "Edit Habit" : "Create New Habit"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300 transition-colors duration-300" htmlFor="title">
              Habit Name
            </label>
            <Input
              id="title"
              placeholder="e.g., Read 10 pages, Workout, Drink Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300 transition-colors duration-300" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200 transition-colors duration-300"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300 transition-colors duration-300" htmlFor="hasReminder">
                Set Reminder Time
              </label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hasReminder" 
                  checked={hasReminder} 
                  onChange={(e) => setHasReminder(e.target.checked)} 
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4 bg-slate-50 dark:bg-slate-950 dark:border-slate-700 transition-colors" 
                />
                <label htmlFor="hasReminder" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  Enable
                </label>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 transition-all duration-300 origin-top ${hasReminder ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute -z-10"}`}>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <select 
                  value={remHour} 
                  onChange={e => setRemHour(e.target.value)} 
                  className="pl-9 flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-950/50 text-slate-900 dark:text-slate-200 transition-colors duration-300"
                >
                  {Array.from({length: 12}).map((_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </select>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <select 
                value={remMin} 
                onChange={e => setRemMin(e.target.value)} 
                className="flex h-10 w-20 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-950/50 text-slate-900 dark:text-slate-200 transition-colors duration-300"
              >
                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                value={remAmPm} 
                onChange={e => setRemAmPm(e.target.value)} 
                className="flex h-10 w-20 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-950/50 text-slate-900 dark:text-slate-200 transition-colors duration-300"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300 transition-colors duration-300" htmlFor="description">
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="e.g., Read a non-fiction book before bed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-violet-500 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors duration-300"
            />
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25 transition-all" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : "Save Habit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
