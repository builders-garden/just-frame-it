import { createAppClient, viemConnector } from "@farcaster/auth-kit";

export const verifyFarcasterSignInMessage = async (
  message: string,
  signature: `0x${string}`,
  nonce: string
) => {
  const appClient = createAppClient({
    ethereum: viemConnector(),
  });

  return await appClient.verifySignInMessage({
    message: message,
    signature: signature,
    domain: process.env.NEXT_PUBLIC_URL
      ? new URL(process.env.NEXT_PUBLIC_URL).hostname
      : "frame-it.builders.garden",
    nonce: nonce,
  });
};
