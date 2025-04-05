import { DemoDay } from "@/lib/constants";
import { useApiMutation } from "./use-api-mutation";
import { useApiQuery } from "./use-api-query";

interface Vote {
  id: string;
  applicationId: string;
  voterFid: number;
  experience: number;
  idea: number;
  virality: number;
  signature: string;
  createdAt: string;
  application: {
    projectName: string;
    teamMember1Username: string;
    teamMember1DisplayName: string;
    teamMember1AvatarUrl: string | null;
  };
}

interface SubmitVoteData {
  applicationId: string;
  experience: number;
  idea: number;
  virality: number;
  signature: string;
  message: string;
}

export function useVotes(applicationId?: string) {
  const queryParams = new URLSearchParams();
  if (applicationId) {
    queryParams.append("applicationId", applicationId);
  }

  return useApiQuery<Vote[]>({
    queryKey: ["votes", { applicationId }],
    url: `/api/votes?${queryParams}`,
    enabled: true,
    isProtected: true,
  });
}

export function useSubmitVote() {
  return useApiMutation<{ success: boolean; vote: Vote }, SubmitVoteData>({
    url: "/api/votes",
    method: "POST",
    body: (data) => data,
    isProtected: true,
  });
}

export const useVotesForDemoDay = (demoDay: DemoDay) => {
  return useApiQuery<Record<string, number>>({
    url: `/api/judging/votes?demoDay=${demoDay}`,
    method: "GET",
    isProtected: true,
    queryKey: ["votes", demoDay],
  });
};
