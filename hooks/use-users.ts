import { NeynarUser } from "@/lib/neynar";
import { useApiQuery } from "./use-api-query";

interface SearchUsersResponse {
  users: NeynarUser[];
}

export function useMe() {
  return useApiQuery<NeynarUser>({
    queryKey: ["me"],
    url: "/api/users/me",
    isProtected: true,
  });
}

export function useSearchUsers(query: string, limit: number = 5) {
  return useApiQuery<SearchUsersResponse>({
    queryKey: ["users", "search", query, limit],
    url: `/api/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    isProtected: true,
    // Don't fetch if query is empty
    enabled: query.length > 0,
  });
}
