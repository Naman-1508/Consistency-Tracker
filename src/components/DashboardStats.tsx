import StatCard from "./dashboard/StatCard";
import WeeklyProgress from "./dashboard/WeeklyProgress";
import DailyMotivation from "./dashboard/DailyMotivation";

export default function DashboardStats({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Current Streak"
        value={`${stats.currentStreak} Days`}
        subtitle="Keep it up!"
        colorClass="text-orange-500/90 dark:text-orange-400"
        delay={0}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
        }
      />
      
      <StatCard
        title="Completion Rate"
        value={`${stats.completionPercentage}%`}
        subtitle="Overall consistency"
        colorClass="text-blue-500/90 dark:text-blue-400"
        delay={100}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        }
      />
      
      <WeeklyProgress weeklyData={stats.weeklyProgress} delay={200} />

      <DailyMotivation delay={300} />
    </div>
  );
}
