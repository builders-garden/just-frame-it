"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { providers } from "ethers";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import FrameWalletProvider from "./frame-wallet-provider";
import dynamic from "next/dynamic";
const queryClient = new QueryClient();

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    person_profiles: "always", // or 'always' to create profiles for anonymous users as well
  });
}

const FrameProvider = dynamic(
  () =>
    import("@/components/farcaster-provider").then((mod) => mod.FrameProvider),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
      </div>
    ),
  }
);

const farcasterConfig = {
  rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
  domain: process.env.NEXT_PUBLIC_URL
    ? new URL(process.env.NEXT_PUBLIC_URL).hostname
    : "frame-it.builders.garden",
  siweUri: process.env.NEXT_PUBLIC_URL || "https://frame-it.builders.garden",
  provider: new providers.JsonRpcProvider(undefined, 10),
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <FrameProvider>
      <FrameWalletProvider>
        <PostHogProvider client={posthog}>
          <QueryClientProvider client={queryClient}>
            <AuthKitProvider config={farcasterConfig}>
              {children}
            </AuthKitProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </FrameWalletProvider>
    </FrameProvider>
  );
};
