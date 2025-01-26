import { useSignIn } from "@/hooks/use-sign-in";
import { useFrame } from "../farcaster-provider";
import { AuthClientError, SignInButton, useProfile } from "@farcaster/auth-kit";
import Button from "../Button";

export default function ApplyButton({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error?: AuthClientError) => void;
}) {
  const { isSDKLoaded, context } = useFrame();
  const { signIn, isLoading: isSigningIn, isSignedIn } = useSignIn();

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

  if (!context || !isSDKLoaded) {
    if (isSignedIn) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={onSuccess}>Apply</Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <SignInButton
            onSuccess={() => {
              handleSignIn();
              onSuccess();
            }}
            onError={onError}
          />
          <span className="text-sm text-gray-400">
            Sign in to apply for the program
          </span>
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
