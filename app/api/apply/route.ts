import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { address } = await req.json();
  console.log(address);
  return NextResponse.json({ message: "Hello World" });
};
