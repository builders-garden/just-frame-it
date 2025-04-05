import { verifyFarcasterSignInMessage } from "@/lib/farcaster-app-client";
import { useCallback } from "react";

import {
  AuthClientError,
  SignInButton,
  StatusAPIResponse,
  useProfile,
} from "@farcaster/auth-kit";
export default function FarcasterSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: ({
    message,
    signature,
    fid,
  }: {
    message: string;
    signature: string;
    fid: number;
  }) => void;
  onError: (error?: AuthClientError) => void;
}) {
  const { isAuthenticated, profile } = useProfile();

  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    if (!res.message || !res.signature || !res.nonce) {
      console.error("Missing message, signature or nonce");
      return;
    }

    try {
      const verifyResponse = await verifyFarcasterSignInMessage(
        res.message,
        res.signature as `0x${string}`,
        res.nonce
      );

      const { success, fid, error } = verifyResponse;
      if (!success) {
        console.error("Invalid signature", error, success, fid);
        onError(error);
        return;
      } else {
        onSuccess({
          message: res.message,
          signature: res.signature,
          fid: res.fid!,
        });
      }
    } catch (error) {
      console.error("Error fetching farcaster data", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isAuthenticated || localStorage.getItem("token")) {
    return <></>;
  }
  return <SignInButton onSuccess={handleSuccess} onError={onError} />;
}
