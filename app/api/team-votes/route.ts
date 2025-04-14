import { prisma } from "@/lib/prisma";
import { DemoDay } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
        demoDay,
      },
      orderBy: {
        points: "desc",
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error("Error fetching team votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
