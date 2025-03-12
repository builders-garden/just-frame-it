"use client";

import { CircularProgress } from "@mui/material";
import { ApplicationRanking } from "@/components/votes/ApplicationRanking";
import { VoteDisplay } from "@/components/votes/VoteDisplay";
import { useEffect, useState } from "react";

export default function VotesPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

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

  // Calculate total scores for each application
  const applicationScores = applications.map((app) => ({
    ...app,
    totalScore: app.votes.reduce(
      (acc: number, vote: any) =>
        acc + (vote.experience + vote.idea + vote.virality),
      0
    ),
    voteCount: app.votes.length,
  }));

  // Sort applications by total score
  const rankedApplications = applicationScores.sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votes & Rankings</h1>

      <div className="grid gap-8">
        {/* Application Rankings */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Application Rankings</h2>
          <ApplicationRanking applications={rankedApplications} />
        </section>

        {/* Individual Votes
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Votes</h2>
          <VoteDisplay applications={applications} voterFid={4461} />
        </section> */}
      </div>
    </div>
  );
}
