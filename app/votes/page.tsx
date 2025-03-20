"use client";

import { ApplicationRanking } from "@/components/votes/ApplicationRanking";
import { useApplications } from "@/hooks/use-applications";
import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import { CircularProgress } from "@mui/material";
import { Application, Vote } from "@prisma/client";
import { useEffect, useState } from "react";

type ApplicationWithScores = Application & {
  votes: Vote[];
  totalScore: number;
  voteCount: number;
};

export default function VotesPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: farcasterUsers } = useFarcasterUsers(
    ALLOWED_VOTER_FIDS.map((fid) => fid.toString())
  ) as { data: { fid: string; pfp_url: string }[] | undefined };

  const { data, isLoading: isLoadingApplications } = useApplications({
    enabled: isAuthenticated,
    limit: 100,
  });

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

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

  // Calculate total scores for each application
  const applicationScores = (data?.applications?.map((app) => ({
    ...app,
    totalScore: app.votes.reduce(
      (acc: number, vote: Vote) =>
        acc + (vote.experience + vote.idea + vote.virality),
      0
    ),
    voteCount: app.votes.length,
  })) ?? []) as unknown as ApplicationWithScores[];

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
          <ApplicationRanking
            applications={rankedApplications}
            farcasterUsers={farcasterUsers || []}
          />
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
