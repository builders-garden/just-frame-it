import { fetchUser } from "@/lib/neynar";
import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "viem";
import * as jose from "jose";

export const POST = async (req: NextRequest) => {
  const { fid, referrerFid, signature, message, userNow } = await req.json();

  const newUser = await fetchUser(fid);

  // Verify signature matches custody address
  const isValidSignature = await verifyMessage({
    address: newUser.custody_address as `0x${string}`,
    message,
    signature,
  });

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  // Generate a session token using fid and current timestamp
  const jwtToken = await new jose.SignJWT({
    fid,
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30 days")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const response = NextResponse.json({ success: true, token: jwtToken });

  return response;
};
