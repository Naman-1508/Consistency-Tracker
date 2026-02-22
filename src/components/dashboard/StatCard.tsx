import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  colorClass?: string;
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  colorClass = "text-slate-500",
  delay = 0
}: StatCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in zoom-in-95 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors duration-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          {value}
        </div>
        <p className="text-xs font-medium text-slate-500/80 dark:text-slate-400/80">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
