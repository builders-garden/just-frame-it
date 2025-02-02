import { useSignIn } from "@/hooks/use-sign-in";
import { useFrame } from "../farcaster-provider";
import { AuthClientError, SignInButton, useProfile } from "@farcaster/auth-kit";
import Button from "../Button";
import { useSignIn as useFarcasterSignIn, QRCode } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";
import QRCodeModal from "../QRCodeModal";

export default function ApplyButton({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error?: AuthClientError) => void;
}) {
  const { isSDKLoaded, context } = useFrame();
  const { signIn, isLoading: isSigningIn, isSignedIn } = useSignIn();
  const {
    signIn: farcasterSignIn,
    connect,
    url,
    data,
    isConnected,
    channelToken,
  } = useFarcasterSignIn({
    onSuccess: ({ fid }) => {
      console.log("Signed in with FID", fid);
      setIsQRCodeVisible(false);
      onSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
    onStatusResponse: (statusData) => {
      console.log(statusData);
    },
    interval: 1000,
    timeout: 30000,
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
    console.log({ url, data });
    if (url && data?.state !== "completed") {
      setIsQRCodeVisible(true);
    }
  }, [url, data]);

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
      return (
        <div>
          <Button onClick={handleFarcasterSignIn}>
            {isFarcasterSignInLoading ? "Signing In..." : "Apply"}
          </Button>
          <QRCodeModal
            isOpen={isQRCodeVisible}
            onClose={handleCloseModal}
            url={url || ""}
            onRetry={handleFarcasterSignIn}
            channelToken={channelToken || ""}
          />
        </div>
      );
    }
  }

  return (
    <Button onClick={handleSignIn}>
      {isSigningIn ? "Signing In..." : "Apply"}
    </Button>
  );
}
