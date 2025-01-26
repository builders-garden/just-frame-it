import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { address } = await req.json();
  return NextResponse.json({ message: "Hello World" });
};
