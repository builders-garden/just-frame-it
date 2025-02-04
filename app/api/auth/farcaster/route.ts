import { createAppClient, viemConnector } from "@farcaster/auth-kit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, signature, nonce, username, pfpUrl } = body;

  if (!message || !signature || !nonce) {
    return NextResponse.json(
      { error: "Missing message, signature or nonce" },
      { status: 400 }
    );
  }

  const appClient = createAppClient({
    ethereum: viemConnector(),
  });

  try {
    console.log(
      "process.env.NEXT_PUBLIC_URL",
      process.env.NEXT_PUBLIC_URL
        ? new URL(process.env.NEXT_PUBLIC_URL).hostname
        : "frame-it.builders.garden"
    );
    const verifyResponse = await appClient.verifySignInMessage({
      message,
      signature: signature as `0x${string}`,
      domain: process.env.NEXT_PUBLIC_URL
        ? new URL(process.env.NEXT_PUBLIC_URL).hostname
        : "frame-it.builders.garden",
      nonce,
    });

    console.log("appClient verifyResponse", verifyResponse);
    const { success, fid, error } = verifyResponse;

    if (!success) {
      console.error("Invalid signature", error, success, fid);
      return NextResponse.json({
        error: "Invalid signature",
        details: error,
        verifyResponse,
      });
    }

    // Assuming verify is a method you'll need to implement separately
    const user = {
      fid: fid.toString(),
      username,
      pfpUrl,
    };

    return NextResponse.json({ status: "ok", data: user });
  } catch (err) {
    console.error("General error", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
