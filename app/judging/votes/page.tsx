"use client";
import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { useTeamVotes } from "@/hooks/use-team-votes";
import { useLeaderboard } from "@/hooks/useLeaderboard";
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
  const [activeTab, setActiveTab] = useState<"demoDays" | "leaderboard">(
    "leaderboard"
  );

  // Fetch team votes for the selected demo day
  const { data: teamVotes, isLoading: isLoadingVotes } =
    useTeamVotes(selectedDemoDay);

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } =
    useLeaderboard();

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

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "leaderboard"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Global Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("demoDays")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "demoDays"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Demo Days
        </button>
      </div>

      {activeTab === "leaderboard" ? (
        <div className="grid gap-8">
          {isLoadingLeaderboard ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            leaderboardData?.map((entry) => (
              <div
                key={entry.teamName}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">{entry.teamName}</h2>
                  <div className="text-xl font-bold text-blue-600">
                    Total Points: {entry.totalPoints}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
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
                <div key={teamName} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{teamName}</h2>
                    <div className="text-lg font-bold text-blue-600">
                      {teamTotals[teamName]} pts
                    </div>
                  </div>

                  <div className="flex flex-row gap-2">
                    {votes.map((vote) => {
                      const voter = (farcasterUsers as FarcasterUser[]).find(
                        (user: FarcasterUser) =>
                          user.fid.toString() === vote.voterFid.toString()
                      );
                      return (
                        <div
                          key={vote.id}
                          className="flex flex-col items-center p-2 gap-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-fit"
                        >
                          {voter?.pfp_url && (
                            <div className="relative w-12 h-12">
                              <Image
                                src={voter.pfp_url}
                                alt={voter.username}
                                className="rounded-full object-cover"
                                fill
                                sizes="48px"
                              />
                            </div>
                          )}
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {vote.points}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
