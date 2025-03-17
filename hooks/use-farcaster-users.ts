import { useApiQuery } from "./use-api-query";

export const useFarcasterUsers = (fids: string[]) => {
  return useApiQuery({
    url: `/api/farcaster/users?fids=${fids.join(",")}`,
    queryKey: ["farcaster-users", fids],
    enabled: fids.length > 0,
    staleTime: 24 * 60 * 60 * 1000, // Data will be considered fresh for 1 day
    gcTime: 24 * 60 * 60 * 1000, // Data will be kept in cache for 1 day
  });
};
