import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";
import { Lightbulb } from "lucide-react";

const MOTIVATIONAL_MESSAGES = [
  "Small steps every day lead to big results.",
  "Consistency is what transforms average into excellence.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your future self will thank you for the work you do today.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Focus on the progress, not the perfection.",
];

export default function DashboardStats({ stats }: { stats: any }) {
  if (!stats) return null;

  // Select a message based on the current day so it changes but stays consistent for the day
  const todayIndex = new Date().getDay() % MOTIVATIONAL_MESSAGES.length;
  const message = MOTIVATIONAL_MESSAGES[todayIndex];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Streak</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-500 dark:text-orange-400"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.currentStreak} Days</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Keep it up!</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500 dark:text-blue-400"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completionPercentage}%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Overall consistency</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly Progress</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-violet-500 dark:text-violet-400"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="flex h-[40px] items-end justify-between pt-2">
            {stats.weeklyProgress?.map((day: any) => {
              const height = day.total > 0 ? Math.max((day.completed / day.total) * 100, 10) : 10;
              const dateObj = new Date(day.date);
              const isToday = format(new Date(), "yyyy-MM-dd") === day.date;
              
              const barHasValue = day.total > 0;
              const isComplete = Number(day.completed) === Number(day.total) && barHasValue;
              const isEmpty = day.completed === 0;

              return (
                <div key={day.date} className="flex flex-col flex-1 items-center justify-end gap-1 px-1 h-full hover:scale-105 transition-transform">
                  <div 
                    className={`w-full max-w-[12px] rounded-t-sm transition-all duration-500 ${
                      isComplete 
                        ? "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                        : !isEmpty
                        ? "bg-blue-400/80 dark:bg-blue-500/60" 
                        : "bg-slate-200 dark:bg-slate-800"
                    }`} 
                    style={{ height: `${height}%` }}
                    title={`${day.completed}/${day.total} on ${day.date}`}
                  />
                  <div className={`text-[10px] uppercase transition-colors duration-300 ${isToday ? "font-bold text-violet-500 dark:text-violet-400" : "text-slate-500 dark:text-slate-500"}`}>
                    {format(dateObj, "ee").charAt(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-violet-500/10 to-blue-500/10 dark:from-violet-500/5 dark:to-blue-500/5 backdrop-blur-xl shadow-xl transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Motivation</CardTitle>
          <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-snug">
            "{message}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
