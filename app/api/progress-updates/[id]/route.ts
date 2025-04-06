import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userFid = request.headers.get("x-user-fid");
    if (!userFid) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id } = params;

    // Check if the update exists and belongs to the user
    const existingUpdate = await prisma.progressUpdate.findUnique({
      where: { id },
    });

    if (!existingUpdate) {
      return new NextResponse("Update not found", { status: 404 });
    }

    if (existingUpdate.authorFid !== parseInt(userFid)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedUpdate = await prisma.progressUpdate.update({
      where: { id },
      data: {
        teamName: body.teamName,
        demoLink: body.demoLink,
        keyFeatures: body.keyFeatures,
        userEngagement: body.userEngagement,
        challenges: body.challenges,
        nextSteps: body.nextSteps,
        additionalNotes: body.additionalNotes,
      },
    });

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error("[PROGRESS_UPDATE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const userFid = request.headers.get("x-user-fid");
  if (!userFid) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingUpdate = await prisma.progressUpdate.findUnique({
    where: { id, authorFid: parseInt(userFid) },
  });

  if (!existingUpdate) {
    return new NextResponse("Update not found", { status: 404 });
  }

  await prisma.progressUpdate.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Update deleted" });
}
