import { Vote } from "@prisma/client";
import { useApiQuery } from "./use-api-query";

interface Application {
  id: string;
  projectName: string;
  projectDescription: string;
  whyAttend: string;
  previousWork: string;
  githubUrl: string;
  canAttendRome: boolean;
  teamMember1Username: string;
  teamMember1DisplayName: string;
  teamMember1AvatarUrl: string | null;
  teamMember2Username: string | null;
  teamMember2DisplayName: string | null;
  teamMember2AvatarUrl: string | null;
  teamMember3Username: string | null;
  teamMember3DisplayName: string | null;
  teamMember3AvatarUrl: string | null;
  createdAt: string;
  votes: Vote[];
}

interface ApplicationsResponse {
  applications: Application[];
  total: number;
  pages: number;
}

export function useApplications({
  projectName,
  limit = 10,
  page = 1,
  enabled = true,
}: {
  projectName?: string;
  limit?: number;
  page?: number;
  enabled?: boolean;
}) {
  const queryParams = new URLSearchParams({
    ...(projectName && { projectName }),
    limit: limit.toString(),
    page: page.toString(),
  });

  return useApiQuery<ApplicationsResponse>({
    queryKey: ["applications", { projectName, limit, page }],
    url: `/api/applications?${queryParams}`,
    enabled,
    isProtected: true,
  });
}
