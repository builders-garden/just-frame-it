"use client";

import FarcasterSignInButton from "@/components/FarcasterSignInButton";
import { TeamProgressModal } from "@/components/TeamProgressModal";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useApiQuery } from "@/hooks/use-api-query";
import { useSignIn } from "@/hooks/use-sign-in";
import { useMe } from "@/hooks/use-users";
import {
  ALLOWED_PROGRESS_UPDATE_FIDS,
  ALLOWED_VOTER_FIDS,
  DEMO_DAY_DATES,
  DemoDay,
} from "@/lib/constants";
import { useProfile } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";

// Get unique team names from ALLOWED_PROGRESS_UPDATE_FIDS
const TEAMS = Array.from(new Set(Object.values(ALLOWED_PROGRESS_UPDATE_FIDS)));

export default function JudgingPage() {
  const { data: user } = useMe();
  const { isAuthenticated } = useProfile();
  const { signIn } = useSignIn({
    onSuccess: () => {},
  });
  const [activeDemoDay, setActiveDemoDay] = useState<DemoDay>(DemoDay.SPRINT_1);
  const [votes, setVotes] = useState<
    Record<string, Partial<Record<DemoDay, number>>>
  >({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [hasExistingVotes, setHasExistingVotes] = useState(false);

  // Fetch existing votes for the current demo day
  const { data: existingVotes, refetch: refetchVotes } = useApiQuery<
    Record<string, number>
  >({
    url: `/api/judging/votes?demoDay=${activeDemoDay}`,
    method: "GET",
    isProtected: true,
    enabled: !!user?.fid,
    queryKey: ["votes", activeDemoDay],
  });

  // Update votes when existing votes are loaded
  useEffect(() => {
    if (existingVotes) {
      // Initialize votes with the structure needed for each team
      const initializedVotes: Record<
        string,
        Partial<Record<DemoDay, number>>
      > = {};

      // For each team that has votes, create the nested structure
      Object.entries(existingVotes).forEach(([team, points]) => {
        initializedVotes[team] = {
          [activeDemoDay]: points,
        };
      });

      setVotes(initializedVotes);
      setHasExistingVotes(Object.keys(existingVotes).length > 0);

      // Calculate total points for the current demo day
      const currentDemoDayPoints = Object.values(existingVotes).reduce(
        (sum: number, points: number) => sum + points,
        0
      );
      setTotalPoints(currentDemoDayPoints);
    }
  }, [existingVotes, activeDemoDay]);

  const { mutate: submitVotes, isPending: isSubmitting } = useApiMutation<
    void,
    { votes: Record<string, number>; demoDay: DemoDay }
  >({
    url: "/api/judging/vote",
    method: "POST",
    isProtected: true,
    body: ({ votes, demoDay }) => ({
      votes,
      demoDay,
    }),
    onSuccess: () => {
      setSuccess("Votes submitted successfully!");
      refetchVotes();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-4 mb-2 text-lg text-gray-600">
              Please sign in with Farcaster to access this page.
            </p>
            <div className="flex justify-center w-full">
              <FarcasterSignInButton
                onSuccess={({ message, signature, fid }) => {
                  signIn({ message, signature, fid });
                }}
                onError={(error) => {
                  console.error("sign in error", error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userFid = user?.fid;
  const isAllowedVoter =
    userFid && ALLOWED_VOTER_FIDS.includes(parseInt(userFid));

  if (!isAllowedVoter) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-4 text-lg text-gray-600">
              You are not authorized to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleVoteChange = (team: string, points: number) => {
    const newVotes = { ...votes };
    const oldPoints = newVotes[team]?.[activeDemoDay] || 0;
    const newTotalPoints = totalPoints - oldPoints + points;

    if (newTotalPoints > 10) {
      setError("Total points cannot exceed 10");
      return;
    }

    if (points === 0) {
      if (newVotes[team]) {
        delete newVotes[team][activeDemoDay];
        if (Object.keys(newVotes[team]).length === 0) {
          delete newVotes[team];
        }
      }
    } else {
      if (!newVotes[team]) {
        newVotes[team] = {};
      }
      newVotes[team][activeDemoDay] = points;
    }

    const currentDemoDayVotes = Object.values(newVotes)
      .map((v) => v[activeDemoDay] || 0)
      .filter((v) => v > 0);

    if (currentDemoDayVotes.length > 4) {
      setError("You can vote for a maximum of 4 teams");
      return;
    }

    setVotes(newVotes);
    setTotalPoints(newTotalPoints);
    setError(null);
  };

  const handleSubmit = () => {
    if (!userFid) return;
    const currentDemoDayVotes = Object.entries(votes).reduce(
      (acc, [team, demoDayVotes]) => {
        if (demoDayVotes[activeDemoDay]) {
          acc[team] = demoDayVotes[activeDemoDay];
        }
        return acc;
      },
      {} as Record<string, number>
    );

    submitVotes({ votes: currentDemoDayVotes, demoDay: activeDemoDay });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Judging</h1>
          <p className="mt-4 text-lg text-gray-600">
            Distribute your 10 points among up to 4 teams
          </p>
        </div>
        <div className="flex flex-col text-blue-500 bg-blue-100 border border-blue-200 rounded-md items-start text-sm p-4">
          <ul className="list-disc list-inside">
            <li>
              You can submit and edit your votes up to 3 days after the demo day
              date.
            </li>
            <li>
              If you click on a team, you will see their progress updates
              submissions.
            </li>
          </ul>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <div className="sm:hidden">
              <select
                value={activeDemoDay}
                onChange={(e) => setActiveDemoDay(e.target.value as DemoDay)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {Object.entries(DEMO_DAY_DATES).map(
                  ([day, { date, isUnlocked }]) => (
                    <option
                      key={day}
                      value={day}
                      disabled={!isUnlocked}
                      className={!isUnlocked ? "text-gray-400" : ""}
                    >
                      {date}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                {Object.entries(DEMO_DAY_DATES).map(
                  ([day, { date, isUnlocked }]) => (
                    <button
                      key={day}
                      onClick={() =>
                        isUnlocked && setActiveDemoDay(day as DemoDay)
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        activeDemoDay === day
                          ? "bg-blue-100 text-blue-700"
                          : isUnlocked
                          ? "text-gray-500 hover:text-gray-700"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isUnlocked}
                    >
                      {date}
                    </button>
                  )
                )}
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            {TEAMS.map((team) => (
              <div key={team} className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsProgressModalOpen(true);
                  }}
                  className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {team}
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleVoteChange(
                        team,
                        (votes[team]?.[activeDemoDay] || 0) - 1
                      )
                    }
                    disabled={!votes[team]?.[activeDemoDay]}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">
                    {votes[team]?.[activeDemoDay] || 0}
                  </span>
                  <button
                    onClick={() =>
                      handleVoteChange(
                        team,
                        (votes[team]?.[activeDemoDay] || 0) + 1
                      )
                    }
                    disabled={totalPoints >= 10}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                Total Points: {totalPoints}/10
              </span>
              <button
                onClick={handleSubmit}
                disabled={
                  totalPoints !== 10 ||
                  Object.keys(votes).length === 0 ||
                  isSubmitting
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Submitting..."
                  : hasExistingVotes
                  ? "Update Votes"
                  : "Submit Votes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {hasExistingVotes && !success && (
        <div className="max-w-3xl mx-auto mt-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md">
          You have already submitted votes for this demo day. You can update
          your votes until the deadline.
        </div>
      )}

      {selectedTeam && (
        <TeamProgressModal
          isOpen={isProgressModalOpen}
          onClose={() => {
            setIsProgressModalOpen(false);
            setSelectedTeam(null);
          }}
          teamName={selectedTeam}
        />
      )}
    </div>
  );
}
