import { useSignIn } from "@/hooks/use-sign-in";
import { useFrame } from "../farcaster-provider";
import {
  AuthClientError,
  SignInButton,
  useProfile,
  useSignInMessage,
  useVerifySignInMessage,
} from "@farcaster/auth-kit";
import Button from "../Button";
import { useSignIn as useFarcasterSignIn, QRCode } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";
import QRCodeModal from "../QRCodeModal";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";

export default function ApplyButton({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error?: AuthClientError) => void;
}) {
  const { isSDKLoaded, context } = useFrame();
  const { signIn, isLoading: isSigningIn, isSignedIn } = useSignIn();
  const { message, signature } = useSignInMessage();
  const {
    isSuccess: isVerifySuccess,
    isError: isVerifyError,
    error: verifyError,
    data: verifyData,
  } = useVerifySignInMessage({
    message,
    signature: signature as `0x${string}`,
  });
  console.log({ isVerifySuccess, isVerifyError, verifyError, verifyData });
  const {
    signIn: farcasterSignIn,
    connect,
    url,
    data,
    error,
    isConnected,
    channelToken,
    isSuccess,
  } = useFarcasterSignIn({
    onSuccess: ({ fid }) => {
      console.log("Signed in with FID", fid);
      setIsQRCodeVisible(false);
      onSuccess();
    },
    onError: (error) => {
      console.error({
        error,
      });
    },
    onStatusResponse: (statusData) => {
      console.log(statusData);
    },
    nonce:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  });
  const [isFarcasterSignInLoading, setIsFarcasterSignInLoading] =
    useState(false);
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);

  const handleFarcasterSignIn = async () => {
    if (data?.state === "completed") {
      onSuccess();
      return;
    }
    try {
      setIsFarcasterSignInLoading(true);
      if (!isConnected) {
        console.log("Connecting...");
        await connect();
      }
      console.log("Signing in...");
      await farcasterSignIn();
    } catch (error) {
      console.error(error);
    } finally {
      setIsFarcasterSignInLoading(false);
    }
  };

  useEffect(() => {
    if (url && data?.state !== "completed") {
      setIsQRCodeVisible(true);
    }
  }, [url, data, isSuccess]);

  const handleSignIn = async () => {
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

  const handleCloseModal = () => {
    setIsQRCodeVisible(false);
  };

  if (!context || !isSDKLoaded) {
    if (isSignedIn) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={onSuccess}>Apply</Button>
        </div>
      );
    } else {
      return <NeynarAuthButton variant={SIWN_variant.FARCASTER} data-border_radius="10px" />;
    }
  }

  return (
    <Button onClick={handleSignIn}>
      {isSigningIn ? "Signing In..." : "Apply"}
    </Button>
  );
}
