import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import Image from "next/image";
import { useFrame } from "../farcaster-provider";

interface FarcasterUser {
  fid: number;
  username: string;
  pfp_url?: string;
}

// Group FIDs by team
const teamFids = Object.entries(ALLOWED_PROGRESS_UPDATE_FIDS).reduce(
  (acc, [fid, team]) => {
    if (team !== "Builders Garden") {
      if (!acc[team]) {
        acc[team] = [];
      }
      acc[team].push(fid);
    }
    return acc;
  },
  {} as Record<string, string[]>
);

// Get all FIDs except Builders Garden
const allFids = Object.entries(ALLOWED_PROGRESS_UPDATE_FIDS)
  .filter(([_, team]) => team !== "Builders Garden")
  .map(([fid]) => fid);

export default function Teams() {
  const { context } = useFrame();
  const { data: users } = useFarcasterUsers(allFids) as {
    data: FarcasterUser[] | undefined;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Selected Teams - Cohort #1</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(teamFids)
          .sort(([, teamA], [, teamB]) => teamA.length - teamB.length)
          .map(([teamName, teamFids]) => (
            <div
              key={teamName}
              className="bg-white/50 p-4 rounded-lg border-2 border-gray-300"
            >
              <h3 className="text-xl font-bold mb-3">{teamName}</h3>
              <div className="flex flex-row gap-4 items-center justify-evenly">
                {teamFids.map((fid) => {
                  const user = users?.find((u) => u.fid.toString() === fid);
                  return (
                    <div
                      key={fid}
                      className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-110"
                      onClick={async () => {
                        if (context) {
                          await sdk.actions.openUrl(
                            `https://warpcast.com/${user?.username}`
                          );
                        } else {
                          window.open(
                            `https://warpcast.com/${user?.username}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-1 bg-white flex items-center justify-center">
                        <Image
                          src={user?.pfp_url || "/images/default-avatar.png"}
                          alt={user?.username || "Team member"}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm">@{user?.username || "..."}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
