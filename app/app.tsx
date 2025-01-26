"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthKitProvider } from "@farcaster/auth-kit";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/Home"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
    </div>
  ),
});

const queryClient = new QueryClient();
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

const config = {
  domain: "frame-it.builders.garden",
  siweUri: "https://frame-it.builders.garden",
  relay: "https://relay.farcaster.xyz",
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthKitProvider config={config}>
        <FrameProvider>
          <Home />
        </FrameProvider>
      </AuthKitProvider>
    </QueryClientProvider>
  );
}
