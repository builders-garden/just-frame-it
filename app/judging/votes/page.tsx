"use client";
import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { useTeamVotes } from "@/hooks/use-team-votes";
import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import { CircularProgress } from "@mui/material";
import { DemoDay } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function JudgingVotesPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDemoDay, setSelectedDemoDay] = useState<DemoDay>(
    DemoDay.SPRINT_1
  );

  // Fetch team votes for the selected demo day
  const { data: teamVotes, isLoading: isLoadingVotes } =
    useTeamVotes(selectedDemoDay);

  // Get unique voter FIDs from the votes
  const voterFids = teamVotes
    ? Array.from(new Set(teamVotes.map((vote) => vote.voterFid.toString())))
    : [];

  // Fetch Farcaster user details for the voters
  const { data: farcasterUsers } = useFarcasterUsers(
    ALLOWED_VOTER_FIDS.map((fid) => fid.toString())
  );

  // Add type for Farcaster user
  interface FarcasterUser {
    fid: string;
    username: string;
    pfp_url?: string;
  }

  useEffect(() => {
    if (teamVotes) {
      setIsLoading(false);
    }
  }, [teamVotes]);

  useEffect(() => {
    if (error) {
      setError(error);
      setIsLoading(false);
    }
  }, [error]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Enter Password
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Enter password..."
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border rounded-lg bg-red-50 text-red-700">
          {error.message}
        </div>
      </div>
    );
  }

  // Group votes by team
  const teamVotesMap = teamVotes?.reduce((acc, vote) => {
    if (!acc[vote.teamName]) {
      acc[vote.teamName] = [];
    }
    acc[vote.teamName].push(vote);
    return acc;
  }, {} as Record<string, typeof teamVotes>);

  // Calculate total points for each team
  const teamTotals = teamVotesMap
    ? Object.entries(teamVotesMap).reduce((acc, [teamName, votes]) => {
        acc[teamName] = votes.reduce((sum, vote) => sum + vote.points, 0);
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Judging Votes</h1>

      {/* Demo Day Tabs */}
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

      {/* Team Votes Display */}
      <div className="grid gap-8">
        {teamVotesMap &&
          Object.entries(teamVotesMap).map(([teamName, votes]) => (
            <div key={teamName} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{teamName}</h2>
                <div className="text-xl font-bold text-blue-600">
                  Total Points: {teamTotals[teamName]}
                </div>
              </div>

              {/* Judge PFPs */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Judges</h3>
                <div className="flex flex-wrap gap-2">
                  {votes.map((vote) => {
                    const voter = (farcasterUsers as FarcasterUser[]).find(
                      (user: FarcasterUser) =>
                        user.fid.toString() === vote.voterFid.toString()
                    );
                    return voter?.pfp_url ? (
                      <Image
                        key={vote.id}
                        src={voter.pfp_url}
                        alt={voter.username}
                        className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                        title={voter.username}
                        width={40}
                        height={40}
                      />
                    ) : null;
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {votes.map((vote) => {
                  const voter = (farcasterUsers as FarcasterUser[]).find(
                    (user: FarcasterUser) =>
                      user.fid === vote.voterFid.toString()
                  );
                  return (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {voter?.pfp_url && (
                          <img
                            src={voter.pfp_url}
                            alt={voter.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">
                          {voter?.username || `Voter ${vote.voterFid}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {vote.points} points
                        </span>
                      </div>
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
