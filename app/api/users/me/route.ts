import { fetchUser } from "@/lib/neynar";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const fid = request.headers.get("x-user-fid");

  if (!fid) {
    return NextResponse.json(
      { error: "Missing required parameter: fid" },
      { status: 400 }
    );
  }

  try {
    const user = await fetchUser(fid);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
