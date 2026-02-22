import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";

interface DayData {
  date: string;
  completed: number;
  total: number;
}

interface WeeklyProgressProps {
  weeklyData: DayData[];
  delay?: number;
}

export default function WeeklyProgress({ weeklyData, delay = 0 }: WeeklyProgressProps) {
  return (
    <Card 
      className="group relative overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in zoom-in-95 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors duration-300">
          Weekly Progress
        </CardTitle>
        <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-500/10 group-hover:scale-110 transition-transform duration-500 text-violet-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex h-[45px] items-end justify-between pt-2">
          {weeklyData?.map((day: DayData, index: number) => {
            // Determine height based on completion ratio, with a minimum height for visibility
            const height = day.total > 0 ? Math.max((day.completed / day.total) * 100, 10) : 10;
            const dateObj = new Date(day.date);
            const isToday = format(new Date(), "yyyy-MM-dd") === day.date;
            
            const barHasValue = day.total > 0;
            const isComplete = Number(day.completed) === Number(day.total) && barHasValue;
            const isEmpty = day.completed === 0;

            return (
              <div 
                key={day.date} 
                className="group/bar flex flex-col flex-1 items-center justify-end gap-1.5 px-0.5 h-full relative cursor-pointer"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none scale-95 group-hover/bar:scale-100 duration-200">
                  {day.completed}/{day.total} habits
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-full max-w-[14px] rounded-t-sm transition-all duration-700 ease-out flex-shrink-0 ${
                    isComplete 
                      ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]" 
                      : !isEmpty
                      ? "bg-blue-400 dark:bg-blue-500" 
                      : "bg-slate-200/50 dark:bg-slate-800/50 group-hover/bar:bg-slate-300 dark:group-hover/bar:bg-slate-700"
                  }`} 
                  style={{ 
                    height: `${height}%`,
                    transitionDelay: `${index * 50}ms`
                  }}
                />
                
                {/* Day Label */}
                <div className={`text-[10px] uppercase font-medium transition-colors duration-300 ${
                  isToday 
                    ? "font-bold text-violet-600 dark:text-violet-400" 
                    : "text-slate-400 dark:text-slate-500 group-hover/bar:text-slate-700 dark:group-hover/bar:text-slate-300"
                }`}>
                  {format(dateObj, "ee").charAt(0)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
