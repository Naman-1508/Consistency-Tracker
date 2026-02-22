import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NoteModalProps {
  isOpen: boolean;
  habitName: string;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function NoteModal({ isOpen, habitName, onClose, onSubmit }: NoteModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNote(""); // Reset on open
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(note);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-sm rounded-[24px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.15)] dark:shadow-[0_0_40px_rgba(139,92,246,0.25)] p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 opacity-70 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-100 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Complete Habit</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You crushed <span className="font-semibold text-slate-700 dark:text-slate-300">"{habitName}"</span>! Any notes for today?
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                autoFocus
                placeholder="Optional: How did it go?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-12 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 text-slate-900 dark:text-slate-200 transition-all duration-300"
              />
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onSubmit("")} // Skip means empty note
                  className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Skip
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5"
                >
                  Save & Check Off
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
