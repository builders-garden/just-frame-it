import { useApiQuery } from "./use-api-query";

interface LeaderboardEntry {
  teamName: string;
  totalPoints: number;
}

export function useLeaderboard() {
  return useApiQuery<LeaderboardEntry[]>({
    url: "/api/team-votes/leaderboard",
    queryKey: ["leaderboard"],
    isProtected: true,
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000 * 60 * 3,
  });
}
