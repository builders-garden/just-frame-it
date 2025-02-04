"use client";

import { useCallback, useState } from "react";
import { useSignIn } from "@/hooks/use-sign-in";
import {
  AuthClientError,
  SignInButton,
  StatusAPIResponse,
  useProfile,
} from "@farcaster/auth-kit";
import { verifyFarcasterSignInMessage } from "@/lib/farcaster-app-client";

import { useFrame } from "../farcaster-provider";
import Button from "../Button";

export default function ApplyButton({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error?: AuthClientError) => void;
}) {
  const { isSDKLoaded, context } = useFrame();
  const { signIn, isLoading: isFrameSigningIn, isSignedIn } = useSignIn();
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, username, pfpUrl },
  } = profile;
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    setIsSigningIn(true);
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
        onSuccess();
      }
    } catch (error) {
      console.error("Error fetching farcaster data", error);
    } finally {
      setIsSigningIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFrameSignIn = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await signIn();
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
      // Optionally show an error message to the user
    }
  };

  if (!context || !isSDKLoaded) {
    if (isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={onSuccess}>Apply</Button>
        </div>
      );
    } else {
      return (
        <div className="h-full">
          <div
            className={`
            px-[30px] py-[1.5] relative justify-center items-center w-full overflow-hidden
            active:translate-y-[2px] rounded-sm border 
            text-xl md:text-2xl font-semibold shadow-md
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
            transition-colors duration-200
           bg-purple-600 hover:bg-purple-700 text-white
            before:absolute before:content-[''] before:top-0 before:left-[-100%] before:w-[120%] before:h-full
            before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
            before:animate-shine before:skew-x-[-25deg]
            `}
          >
            <div className="text-2xl absolute h-full w-[70%] sm:w-[70%] flex items-center justify-center mx-auto">
              {isSigningIn ? "Signing In..." : "Apply"}
            </div>
            <div
              id="fc-btn-wrap"
              className="py-2 size-full flex items-center justify-center opacity-0 w-full"
            >
              <SignInButton onSuccess={handleSuccess} hideSignOut />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <Button isLoading={isFrameSigningIn} onClick={handleFrameSignIn}>
      <div className="px-[30px] py-[0.3rem] flex flex-row items-center justify-center gap-2">
        Apply
      </div>
    </Button>
  );
}
