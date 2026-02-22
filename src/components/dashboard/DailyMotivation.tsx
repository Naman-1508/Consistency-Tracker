import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Lightbulb } from "lucide-react";

const MOTIVATIONAL_MESSAGES = [
  "Small steps every day lead to big results.",
  "Consistency is what transforms average into excellence.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your future self will thank you for the work you do today.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Focus on the progress, not the perfection.",
  "We are what we repeatedly do. Excellence is not an act, but a habit."
];

export default function DailyMotivation({ delay = 0 }: { delay?: number }) {
  // Select a message based on the current day so it changes but stays consistent for the day
  const todayIndex = new Date().getDay() % MOTIVATIONAL_MESSAGES.length;
  const message = MOTIVATIONAL_MESSAGES[todayIndex];

  return (
    <Card 
      className="group relative overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-blue-500/10 dark:from-violet-500/10 dark:via-fuchsia-500/5 dark:to-blue-500/10 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in zoom-in-95 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Daily Motivation
        </CardTitle>
        <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 text-yellow-500">
          <Lightbulb className="h-4 w-4" />
        </div>
      </CardHeader>
      
      <CardContent className="relative pt-2">
        <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
          "{message}"
        </p>
      </CardContent>
    </Card>
  );
}
