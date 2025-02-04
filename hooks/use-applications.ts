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
}

interface ApplicationsResponse {
  applications: Application[];
  total: number;
  pages: number;
}

export function useApplications({
  username,
  limit = 10,
  page = 1,
  enabled = true,
}: {
  username?: string;
  limit?: number;
  page?: number;
  enabled?: boolean;
}) {
  const queryParams = new URLSearchParams({
    ...(username && { username }),
    limit: limit.toString(),
    page: page.toString(),
  });

  return useApiQuery<ApplicationsResponse>({
    queryKey: ["applications", { username, limit, page }],
    url: `/api/applications?${queryParams}`,
    enabled,
    isProtected: true,
  });
}
