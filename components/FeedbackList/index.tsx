import { useApiQuery } from "@/hooks/use-api-query";
import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { useMe } from "@/hooks/use-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { DemoDay } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";

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

interface FarcasterUser {
  fid: string;
  username: string;
  pfp_url?: string;
}

export function FeedbackList() {
  const { data: user } = useMe();
  const [selectedDemoDay, setSelectedDemoDay] = useState<DemoDay>(
    DemoDay.SPRINT_1
  );

  const { data: allTeamVotes, isLoading } = useApiQuery<TeamVote[]>({
    queryKey: ["team-votes", selectedDemoDay],
    url: `/api/team-votes?demoDay=${selectedDemoDay}`,
    enabled: true,
    isProtected: true,
  });

  // Get unique voter FIDs
  const voterFids = allTeamVotes
    ? Array.from(new Set(allTeamVotes.map((vote) => vote.voterFid.toString())))
    : [];

  // Fetch Farcaster user details for the voters
  const { data: farcasterUsers } = useFarcasterUsers(voterFids) as {
    data: FarcasterUser[] | undefined;
  };

  if (!user) {
    return (
      <div className="text-center py-8">Please sign in to view feedback</div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  const userTeamName = ALLOWED_PROGRESS_UPDATE_FIDS[user.fid];
  if (!userTeamName) {
    return (
      <div className="text-center py-8">No team found for your account</div>
    );
  }

  // Filter votes for the user's team
  const filteredTeamVotes =
    allTeamVotes?.filter((vote) => vote.teamName === userTeamName) || [];
  const totalPoints = filteredTeamVotes.reduce(
    (sum, vote) => sum + vote.points,
    0
  );
  const feedbacks = filteredTeamVotes
    .filter((vote) => vote.notes)
    .map((vote) => ({
      notes: vote.notes,
      date: vote.createdAt,
      voterFid: vote.voterFid,
    }));

  return (
    <div className="space-y-6">
      {/* Demo Day Selection */}
      <div className="flex space-x-4 mb-8">
        {Object.values(DemoDay).map((demoDay) => (
          <button
            key={demoDay}
            onClick={() => setSelectedDemoDay(demoDay)}
            className={`px-4 py-2 rounded-lg ${
              selectedDemoDay === demoDay
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {demoDay.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{userTeamName}</h2>
            <div className="text-lg font-bold text-blue-600">
              {totalPoints} pts
            </div>
          </div>

          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No feedback available for this demo day
              </p>
            ) : (
              feedbacks.map((feedback, index) => {
                const voter = farcasterUsers?.find(
                  (u: FarcasterUser) =>
                    u.fid.toString() === feedback.voterFid.toString()
                );
                return (
                  <div key={index} className="border-t pt-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          {voter?.pfp_url ? (
                            <Image
                              src={voter.pfp_url}
                              alt={voter.username}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              @{voter?.username || "Unknown"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(feedback.date), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {feedback.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
