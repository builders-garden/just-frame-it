import { NextResponse, NextRequest } from "next/server";
import { getApplications } from "@/lib/prisma/queries";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username') || undefined;
    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;

    const result = await getApplications({
      username,
      limit,
      page,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
} 