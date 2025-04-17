import { DemoDay } from "@prisma/client";
import { useApiQuery } from "./use-api-query";

interface TeamVote {
  id: string;
  createdAt: string;
  updatedAt: string;
  voterFid: number;
  teamName: string;
  points: number;
  demoDay: DemoDay;
  notes?: string;
}

export function useTeamVotes(demoDay: DemoDay) {
  return useApiQuery<TeamVote[]>({
    queryKey: ["team-votes", demoDay],
    url: `/api/team-votes?demoDay=${demoDay}`,
    enabled: !!demoDay,
    isProtected: true,
  });
}
