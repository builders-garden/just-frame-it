import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const fid = Number(req.headers.get("x-user-fid"));
    if (!fid) {
      return NextResponse.json(
        { error: "User FID is required" },
        { status: 400 }
      );
    }

    // Get application data from request
    const data = await req.json();

    const {
      teamMembers, // Array of {fid, username, displayName, avatarUrl}
      projectName,
      projectDescription,
      whyAttend,
      previousWork,
      creatorDisplayName,
      creatorUsername,
      creatorAvatarUrl,
      githubUrl,
      canAttendRome,
    } = data;

    // Validate required fields
    if (
      !projectName ||
      !projectDescription ||
      !whyAttend ||
      !creatorUsername ||
      !creatorDisplayName ||
      !githubUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(teamMembers)) {
      return NextResponse.json(
        { error: "Team members must be an array" },
        { status: 400 }
      );
    }

    if (teamMembers?.length > 2) {
      return NextResponse.json(
        { error: "Can have 0-2 additional team members" },
        { status: 400 }
      );
    }

    // Validate each team member's data if array is not empty
    for (const member of teamMembers) {
      if (!member.fid || !member.username || !member.displayName) {
        return NextResponse.json(
          {
            error: "Each team member must have fid, username, and displayName",
          },
          { status: 400 }
        );
      }
    }

    // Create application in database
    const application = await prisma.application.create({
      data: {
        projectName,
        projectDescription,
        whyAttend,
        previousWork: previousWork || "",
        githubUrl,
        canAttendRome,

        // Team member 1 (creator) is required
        teamMember1Fid: fid,
        teamMember1DisplayName: creatorDisplayName,
        teamMember1Username: creatorUsername,
        teamMember1AvatarUrl: creatorAvatarUrl,

        // Team member 2 (optional)
        ...(teamMembers?.length > 0 && {
          teamMember2Fid: Number(teamMembers[0].fid),
          teamMember2DisplayName: teamMembers[0].displayName,
          teamMember2Username: teamMembers[0].username,
          teamMember2AvatarUrl: teamMembers[0].avatarUrl || null,
        }),

        // Team member 3 (optional)
        ...(teamMembers?.length === 2 && {
          teamMember3Fid: Number(teamMembers[1].fid),
          teamMember3DisplayName: teamMembers[1].displayName,
          teamMember3Username: teamMembers[1].username,
          teamMember3AvatarUrl: teamMembers[1].avatarUrl || null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
