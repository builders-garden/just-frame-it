import { fetchUser } from "@/lib/neynar";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userFid = req.headers.get("x-user-fid");
    if (!userFid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      teamName,
      demoLink,
      keyFeatures,
      technicalMilestones,
      userEngagement,
      challenges,
      nextSteps,
      additionalNotes,
    } = body;

    // Validate required fields
    if (
      !teamName ||
      !keyFeatures ||
      !technicalMilestones ||
      !userEngagement ||
      !challenges ||
      !nextSteps
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user details from Farcaster
    const farcasterUser = await fetchUser(userFid);

    if (!farcasterUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the progress update
    const progressUpdate = await prisma.progressUpdate.create({
      data: {
        teamName,
        demoLink,
        keyFeatures,
        technicalMilestones,
        userEngagement,
        challenges,
        nextSteps,
        additionalNotes,
        authorFid: parseInt(userFid),
        authorDisplayName: farcasterUser.display_name || "",
        authorUsername: farcasterUser.username || "",
        authorAvatarUrl: farcasterUser.pfp_url || null,
      },
    });

    return NextResponse.json(progressUpdate);
  } catch (error) {
    console.error("Error creating progress update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamName = searchParams.get("teamName");

    if (teamName) {
      const updates = await prisma.progressUpdate.findMany({
        where: {
          teamName,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(updates);
    }

    const updates = await prisma.progressUpdate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching progress updates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
