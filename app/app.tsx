"use client";

import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/Home"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
    </div>
  ),
});

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

export default function App() {
  return (
    <FrameProvider>
      <Home />
    </FrameProvider>
  );
}
