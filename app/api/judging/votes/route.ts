import { DemoDay } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const fid = request.headers.get("x-user-fid");

    if (!fid) {
      return NextResponse.json(
        { error: "Missing required parameter: fid" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const demoDay = searchParams.get("demoDay") as DemoDay;

    if (!demoDay) {
      return NextResponse.json(
        { error: "Demo day is required" },
        { status: 400 }
      );
    }

    const votes = await prisma.teamVote.findMany({
      where: {
        voterFid: parseInt(fid),
        ...(demoDay ? { demoDay } : {}),
      },
      select: {
        teamName: true,
        points: true,
      },
    });

    // Convert to a record of teamName -> points
    const votesRecord = votes.reduce((acc, vote) => {
      acc[vote.teamName] = vote.points;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(votesRecord);
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
