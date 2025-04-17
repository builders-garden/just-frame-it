import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { DemoDay } from "@prisma/client";
import { NextResponse } from "next/server";

type Votes = {
  [teamName: string]: {
    points: number;
    notes?: string;
  };
};

export async function POST(request: Request) {
  try {
    const voterFid = parseInt(request.headers.get("x-user-fid") || "");
    const { votes, demoDay } = (await request.json()) as {
      votes: Votes;
      demoDay: DemoDay;
    };

    // Validate voter
    if (!voterFid || !ALLOWED_VOTER_FIDS.includes(voterFid)) {
      return NextResponse.json(
        { error: "Unauthorized voter" },
        { status: 401 }
      );
    }

    // Validate votes
    const totalPoints = Object.values(votes).reduce(
      (acc, vote) => acc + vote.points,
      0
    );

    if (totalPoints !== 10) {
      return NextResponse.json(
        { error: "Total points must equal 10" },
        { status: 400 }
      );
    }

    if (Object.keys(votes).length > 4) {
      return NextResponse.json(
        { error: "Cannot vote for more than 4 teams" },
        { status: 400 }
      );
    }

    // Delete existing votes for this voter
    await prisma.teamVote.deleteMany({
      where: { voterFid },
    });

    // Create new votes
    const votePromises = Object.entries(votes).map(([teamName, vote]) =>
      prisma.teamVote.create({
        data: {
          voterFid,
          teamName,
          points: vote.points,
          notes: vote.notes,
          demoDay,
        },
      })
    );

    await Promise.all(votePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting votes:", error);
    return NextResponse.json(
      { error: "Failed to submit votes" },
      { status: 500 }
    );
  }
}
