export interface NeynarUser {
  fid: string;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  verifications: string[];
}

export const fetchUser = async (fid: string): Promise<NeynarUser> => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY!,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Farcaster user on Neynar");
  }
  const data = await response.json();
  return data.users[0];
};

export const searchUsers = async (
  query: string,
  viewerFid?: string,
  limit: number = 5
): Promise<NeynarUser[]> => {
  const url = new URL("https://api.neynar.com/v2/farcaster/user/search");
  url.searchParams.append("q", query);
  if (viewerFid) {
    url.searchParams.append("viewer_fid", viewerFid);
  }
  url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": process.env.NEYNAR_API_KEY!,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  if (!data.result?.users) {
    return [];
  }
  return data.result.users;
};

type NeynarResponse = {
  users: NeynarUser[];
};

export const fetchUsers = async (fids: string[]): Promise<NeynarUser[]> => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}`,
    {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY!,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to fetch Farcaster user on Neynar: ${JSON.stringify(errorData)}`
    );
  }

  const data = (await response.json()) as NeynarResponse;

  if (!data.users?.[0]) {
    throw new Error("No user found in Neynar response");
  }

  return data.users;
};