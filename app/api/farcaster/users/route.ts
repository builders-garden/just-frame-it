import { fetchUsers } from "@/lib/neynar";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const fids = request.nextUrl.searchParams.get("fids");
  if (!fids) {
    return NextResponse.json({ error: "fids is required" }, { status: 400 });
  }
  const users = await fetchUsers(fids.split(","));
  return NextResponse.json(users);
};
