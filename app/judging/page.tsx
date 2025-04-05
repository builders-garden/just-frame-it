"use client";

import FarcasterSignInButton from "@/components/FarcasterSignInButton";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useSignIn } from "@/hooks/use-sign-in";
import { useMe } from "@/hooks/use-users";
import {
  ALLOWED_PROGRESS_UPDATE_FIDS,
  ALLOWED_VOTER_FIDS,
} from "@/lib/constants";
import { useProfile } from "@farcaster/auth-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Get unique team names from ALLOWED_PROGRESS_UPDATE_FIDS
const TEAMS = Array.from(new Set(Object.values(ALLOWED_PROGRESS_UPDATE_FIDS)));

export default function JudgingPage() {
  const { data: user } = useMe();
  const { isAuthenticated } = useProfile();
  const router = useRouter();
  const { signIn } = useSignIn({
    onSuccess: () => {
      console.log("sign in success");
    },
  });
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { mutate: submitVotes } = useApiMutation<void, Record<string, number>>({
    url: "/api/judging/vote",
    method: "POST",
    headers: {
      "x-user-fid": user?.fid?.toString() || "",
    },
    onSuccess: () => {
      setSuccess("Votes submitted successfully!");
      setVotes({});
      setTotalPoints(0);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-4 text-lg text-gray-600">
              Please sign in with Farcaster to access this page.
            </p>
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
    const oldPoints = newVotes[team] || 0;
    const newTotalPoints = totalPoints - oldPoints + points;

    if (newTotalPoints > 10) {
      setError("Total points cannot exceed 10");
      return;
    }

    if (points === 0) {
      delete newVotes[team];
    } else {
      newVotes[team] = points;
    }

    if (Object.keys(newVotes).length > 4) {
      setError("You can vote for a maximum of 4 teams");
      return;
    }

    setVotes(newVotes);
    setTotalPoints(newTotalPoints);
    setError(null);
  };

  const handleSubmit = () => {
    if (!userFid) return;
    submitVotes(votes);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Judging</h1>
          <p className="mt-4 text-lg text-gray-600">
            Distribute your 10 points among up to 4 teams
          </p>
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
          <div className="space-y-6">
            {TEAMS.map((team) => (
              <div key={team} className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  {team}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleVoteChange(team, (votes[team] || 0) - 1)
                    }
                    disabled={!votes[team]}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{votes[team] || 0}</span>
                  <button
                    onClick={() =>
                      handleVoteChange(team, (votes[team] || 0) + 1)
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
                disabled={totalPoints !== 10 || Object.keys(votes).length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Votes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
