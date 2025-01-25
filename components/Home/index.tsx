"use client";

import { useApply } from "@/hooks/use-apply";
import { useFrame } from "../farcaster-provider";
import SafeAreaContainer from "../SafeAreaContainer";
import { Climate_Crisis } from "next/font/google";
import { useState } from "react";
import ApplyModal, { ApplyFormData } from "../ApplyModal";
import { useSignIn } from "@/hooks/use-sign-in";
import ProgramInfoModal from "../ProgramInfoModal";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

export default function Home() {
  const { context } = useFrame();
  const { mutateAsync: apply, isPending } = useApply();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { signIn, isLoading: isSigningIn } = useSignIn();
  const [isProgramInfoModalOpen, setIsProgramInfoModalOpen] = useState(false);

  const handleApplyClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await signIn();
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to sign in:", error);
      // Optionally show an error message to the user
    }
  };

  const handleApply = async (data: ApplyFormData) => {
    await apply(data);
    setIsModalOpen(false);
  };

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/images/pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4">
        {/* Hero Section */}
        <div className="w-full max-w-5xl mx-auto text-center space-y-6 py-16">
          <h1
            className={`font-bold text-purple-600 border py-1 border-blue-500 relative`}
          >
            <div className="absolute w-2 h-2 bg-white border border-blue-500 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 bg-white border border-blue-500 top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 bg-white border border-blue-500 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-2 h-2 bg-white border border-blue-500 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
            <div className="flex flex-col gap-4">
              <p
                className={`text-4xl text-purple-500 ${climateCrisis.className}`}
              >
                Just Frame It
              </p>
              <p className="text-purple-500 font-normal">
                Build sprint to reframe the future of social feeds.
              </p>
            </div>
          </h1>

          {/* Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs font-bold text-purple-500">
            <div className="border-2 border-purple-500 px-6 py-2 bg-white/50">
              6 TEAMS
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 bg-white/50">
              HYBRID BUILDATHON
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 bg-white/50">
              ONLINE - NYC - ROME
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 bg-white/50">
              APR 7TH - JUNE 7TH
            </div>
          </div>
        </div>

        {/* Apply Button Section */}
        <div className="w-full max-w-5xl mx-auto text-center pb-8">
          {/* Learn More Link */}
          <button
            onClick={() => setIsProgramInfoModalOpen(true)}
            className="mb-4 text-purple-600 underline hover:text-purple-700 transition-colors duration-200"
          >
            Learn More
          </button>

          <div>
            <button
              onClick={handleApplyClick}
              disabled={isSigningIn}
              className="px-8 py-4 bg-purple-600 text-white text-xl font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSigningIn ? "Connecting..." : "Apply Now"}
            </button>
            <p className="text-purple-500 mt-4">
              Applications closing on March 16th
            </p>
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApply}
        isLoading={isPending}
      />

      <ProgramInfoModal
        isOpen={isProgramInfoModalOpen}
        onClose={() => setIsProgramInfoModalOpen(false)}
      />
    </SafeAreaContainer>
  );
}
