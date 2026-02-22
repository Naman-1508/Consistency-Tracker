import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays, format, parseISO, differenceInDays } from "date-fns";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const habits = await prisma.habit.findMany({
            where: { userId: session.user.id },
            include: { logs: true },
        });

        if (habits.length === 0) {
            return NextResponse.json({
                currentStreak: 0,
                completionPercentage: 0,
                weeklyProgress: [],
            });
        }

        // Calculate Weekly Progress
        const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(new Date(), i), "yyyy-MM-dd")).reverse();

        // weeklyProgress format: { date: "2023-10-01", completed: 3, total: 5 }
        const weeklyProgress = last7Days.map(date => {
            let completed = 0;
            habits.forEach((habit: any) => {
                if (habit.logs.some((log: any) => log.date === date)) {
                    completed++;
                }
            });
            return { date, completed, total: habits.length };
        });

        // Calculate global streak and overall completion percentage
        let totalLogs = 0;
        let globalStreak = 0;

        let currentDate = new Date();
        let currentFormattedDate = format(currentDate, "yyyy-MM-dd");
        let streakBroken = false;

        // A simple global streak: how many consecutive days user completed at least ONE habit
        // Starting from today or yesterday
        const allUniqueLogDates = new Set<string>();
        habits.forEach((habit: any) => {
            totalLogs += habit.logs.length;
            habit.logs.forEach((log: any) => allUniqueLogDates.add(log.date));
        });

        const hasLogToday = allUniqueLogDates.has(currentFormattedDate);
        const hasLogYesterday = allUniqueLogDates.has(format(subDays(currentDate, 1), "yyyy-MM-dd"));

        if (hasLogToday || hasLogYesterday) {
            let checkDate = hasLogToday ? currentDate : subDays(currentDate, 1);
            while (!streakBroken) {
                if (allUniqueLogDates.has(format(checkDate, "yyyy-MM-dd"))) {
                    globalStreak++;
                    checkDate = subDays(checkDate, 1);
                } else {
                    streakBroken = true;
                }
            }
        }

        // Overall Completion Percentage (total logs / (total habits * days since first habit))
        let earliestHabitDate = new Date();
        habits.forEach((habit: any) => {
            if (new Date(habit.createdAt) < earliestHabitDate) {
                earliestHabitDate = new Date(habit.createdAt);
            }
        });

        const daysSinceStart = Math.max(1, differenceInDays(new Date(), earliestHabitDate) + 1);
        const maxPossibleLogs = habits.length * daysSinceStart;
        const completionPercentage = maxPossibleLogs > 0 ? Math.round((totalLogs / maxPossibleLogs) * 100) : 0;

        return NextResponse.json({
            currentStreak: globalStreak,
            completionPercentage,
            weeklyProgress,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
