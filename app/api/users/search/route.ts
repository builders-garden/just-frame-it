import { searchUsers } from "@/lib/neynar";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewerFid = request.headers.get("x-user-fid");
  const query = searchParams.get("q");
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 5;

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: q" },
      { status: 400 }
    );
  }

  try {
    const users = await searchUsers(query, viewerFid!, limit);
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
