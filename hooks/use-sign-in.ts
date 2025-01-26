import { sdk } from "@farcaster/frame-sdk";
import { useFrame } from "@/components/farcaster-provider";
import { useCallback, useEffect, useState } from "react";
import { MESSAGE_EXPIRATION_TIME } from "@/lib/constants";
import posthog from "posthog-js";
import { useProfile, useSignInMessage } from "@farcaster/auth-kit";

export const useSignIn = () => {
  const { isSDKLoaded, context, error: contextError } = useFrame();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { message, signature } = useSignInMessage();
  const { isAuthenticated, profile } = useProfile();

  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let result: { message: string; signature: string } = {
        message: "",
        signature: "",
      };
      let userFid: number | undefined;

      if (context) {
        result = await sdk.actions.signIn({
          nonce: Math.random().toString(36).substring(2),
          notBefore: new Date().toISOString(),
          expirationTime: new Date(
            Date.now() + MESSAGE_EXPIRATION_TIME
          ).toISOString(),
        });
        userFid = context.user.fid;
      } else if (isAuthenticated) {
        if (!message || !signature) {
          throw new Error("No message or signature found");
        }
        userFid = profile.fid;
        result = {
          message: message || "",
          signature: signature || "",
        };
      }

      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature: result.signature,
          message: result.message,
          fid: userFid,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Sign in failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setIsSignedIn(true);
      // posthog.identify(context.user.fid.toString());
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [context, isAuthenticated, message, profile.fid, signature]);

  useEffect(() => {
    if (isAuthenticated) {
      signIn();
    }
  }, [isAuthenticated, signIn]);

  return { signIn, isSignedIn, isLoading, error };
};
