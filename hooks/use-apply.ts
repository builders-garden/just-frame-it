import { useApiMutation } from "./use-api-mutation";

export interface ApplyFormData {
  teamMembers: Array<{
    fid: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }>;
  projectName: string;
  projectDescription: string;
  whyAttend: string;
  previousWork?: string;
  creatorDisplayName: string;
  creatorUsername: string;
  creatorAvatarUrl?: string;
  githubUrl: string;
  canAttendRome: boolean;
}

export function useApply() {
  return useApiMutation<void, ApplyFormData>({
    url: "/api/apply",
    body: (data) => data,
    isProtected: true,
    method: "POST",
  });
}
