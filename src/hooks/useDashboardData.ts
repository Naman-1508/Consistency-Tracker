import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardData() {
    const { data: habits, error: habitsError, mutate: mutateHabits } = useSWR('/api/habits', fetcher);
    const { data: stats, error: statsError, mutate: mutateStats } = useSWR('/api/dashboard', fetcher);

    const isLoading = !habits && !habitsError && !stats && !statsError;
    const isError = habitsError || statsError;

    return {
        habits: Array.isArray(habits) ? habits : [],
        stats: stats || null,
        isLoading,
        isError,
        mutateHabits,
        mutateStats,
    };
}
