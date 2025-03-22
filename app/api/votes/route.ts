import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fid = Number(req.headers.get("x-user-fid"));
    if (!fid) {
      return NextResponse.json(
        { error: "User FID is required" },
        { status: 400 }
      );
    }

    // Check if user is in allowlist
    if (!ALLOWED_VOTER_FIDS.includes(fid)) {
      return NextResponse.json(
        { error: "You are not authorized to vote" },
        { status: 403 }
      );
    }

    const { applicationId, experience, idea, virality } =
      await req.json();

    // Validate required fields
    if (!applicationId || !experience || !idea || !virality) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate vote values are between 1 and 10
    if (
      experience < 1 ||
      experience > 10 ||
      idea < 1 ||
      idea > 10 ||
      virality < 1 ||
      virality > 10
    ) {
      return NextResponse.json(
        { error: "Vote values must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // // Verify the signature
    // try {
    //   const voter = await fetchUser(fid.toString());

    //   // First try custody address
    //   let isValidSignature = false;
    //   if (voter.custody_address) {
    //     isValidSignature = await verifyMessage({
    //       address: voter.custody_address as `0x${string}`,
    //       message,
    //       signature,
    //     });
    //   }

    //   // If custody fails, try verification addresses
    //   if (!isValidSignature && voter.verifications) {
    //     for (const address of voter.verifications) {
    //       isValidSignature = await verifyMessage({
    //         address: address as `0x${string}`,
    //         message,
    //         signature,
    //       });
    //       if (isValidSignature) break;
    //     }
    //   }

    //   if (!isValidSignature) {
    //     return NextResponse.json(
    //       {
    //         error:
    //           "Invalid signature - not signed by custody or verified address",
    //       },
    //       { status: 401 }
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error verifying signature:", error);
    //   return NextResponse.json(
    //     { error: "Failed to verify signature" },
    //     { status: 400 }
    //   );
    // }

    // Create or update vote
    const vote = await prisma.vote.upsert({
      where: {
        applicationId_voterFid: {
          applicationId,
          voterFid: fid,
        },
      },
      create: {
        applicationId,
        voterFid: fid,
        experience,
        idea,
        virality,
        signature: "n/a",
      },
      update: {
        experience,
        idea,
        virality,
        signature: "n/a",
      },
    });

    return NextResponse.json({
      success: true,
      vote,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const fid = Number(req.headers.get("x-user-fid"));
    if (!fid) {
      return NextResponse.json(
        { error: "User FID is required" },
        { status: 400 }
      );
    }

    // Check if user is in allowlist
    if (!ALLOWED_VOTER_FIDS.includes(fid)) {
      return NextResponse.json(
        { error: "You are not authorized to view votes" },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const applicationId = searchParams.get("applicationId");

    const votes = await prisma.vote.findMany({
      where: applicationId ? { applicationId } : undefined,
      include: {
        application: {
          select: {
            projectName: true,
            teamMember1Username: true,
            teamMember1DisplayName: true,
            teamMember1AvatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}
