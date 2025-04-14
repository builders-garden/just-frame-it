import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leaderboard = await prisma.teamVote.groupBy({
      by: ["teamName"],
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
    });

    // Transform the result to a more readable format
    const formattedLeaderboard = leaderboard.map((entry) => ({
      teamName: entry.teamName,
      totalPoints: entry._sum.points || 0,
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("Error fetching team leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
