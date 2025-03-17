import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import Image from "next/image";
import { useFrame } from "../farcaster-provider";

interface FarcasterUser {
  username: string;
  display_name: string;
  pfp_url: string | null;
  profile: {
    bio: {
      text: string;
    };
  };
}

export default function Mentors() {
  const { data: mentors, isLoading } = useFarcasterUsers(
    ALLOWED_VOTER_FIDS.map((fid) => fid.toString())
  );

  const { context } = useFrame();

  if (isLoading) {
    return <div>Loading mentors...</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-purple-600">Mentors and Judges:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(mentors as FarcasterUser[])?.map((mentor) => (
          <div
            key={mentor.username}
            onClick={async () => {
              if (context) {
                await sdk?.actions.openUrl(
                  `https://warpcast.com/${mentor.username}`
                );
              } else {
                window.open(
                  `https://warpcast.com/${mentor.username}`,
                  "_blank"
                );
              }
            }}
            className="cursor-pointer flex flex-col justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors hover:shadow-sm"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={mentor.pfp_url || ""}
                  alt={mentor.display_name}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <h4 className="font-semibold text-purple-600">
                    {mentor.display_name}
                  </h4>
                  <p className="text-xs text-gray-500">@{mentor.username}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {mentor.profile?.bio?.text || ""}
              </p>
            </div>
            {context ? (
              <p
                className="text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                onClick={async () => {
                  await sdk?.actions.openUrl(
                    `https://warpcast.com/${mentor.username}`
                  );
                }}
              >
                View Profile
                <span className="text-xs">→</span>
              </p>
            ) : (
              <a
                href={`https://warpcast.com/${mentor.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Profile
                <span className="text-xs">→</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
