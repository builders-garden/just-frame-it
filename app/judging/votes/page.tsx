"use client";
import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { useTeamVotes } from "@/hooks/use-team-votes";
import { CircularProgress } from "@mui/material";
import { DemoDay } from "@prisma/client";
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
  const { data: farcasterUsers } = useFarcasterUsers(voterFids);

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
              <h2 className="text-2xl font-semibold mb-4">{teamName}</h2>
              <div className="space-y-4">
                {votes.map((vote) => {
                  const voter = (farcasterUsers as FarcasterUser[]).find(
                    (user: FarcasterUser) =>
                      user.fid === vote.voterFid.toString()
                  );
                  return (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {voter?.pfp_url && (
                          <img
                            src={voter.pfp_url}
                            alt={voter.username}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {voter?.username || `Voter ${vote.voterFid}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Points: {vote.points}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(vote.createdAt).toLocaleDateString()}
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
