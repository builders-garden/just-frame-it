"use client";

import { useApply } from "@/hooks/use-apply";
import { useFrame } from "../farcaster-provider";
import SafeAreaContainer from "../SafeAreaContainer";
import { Climate_Crisis } from "next/font/google";
import { useState, useEffect } from "react";
import ApplyModal, { ApplyFormData } from "../ApplyModal";
import { useSignIn } from "@/hooks/use-sign-in";
import ProgramInfoModal from "../ProgramInfoModal";
import Image from "next/image";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

export default function Home() {
  const { context } = useFrame();
  const { mutateAsync: apply, isPending } = useApply();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { signIn, isLoading: isSigningIn } = useSignIn();
  const [isProgramInfoModalOpen, setIsProgramInfoModalOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to March 16, 2025 23:59:59 Rome time (UTC+1 in winter, UTC+2 in summer)
    // March is in winter time (CET), so UTC+1
    const targetDate = new Date("2025-03-16T22:59:59Z"); // 23:59:59 Rome time (UTC+1)

    const updateCountdown = () => {
      // Convert current time to Rome time
      const now = new Date();
      const romeOffset = 60; // Rome timezone offset in minutes (UTC+1)
      const localOffset = now.getTimezoneOffset();
      const adjustedNow = new Date(
        now.getTime() + (localOffset + romeOffset) * 60000
      );

      const diff = targetDate.getTime() - adjustedNow.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Layer 1 - Short scattered lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `
              linear-gradient(45deg, transparent 15%, #9333ea 15.25%, transparent 15.75%),
              linear-gradient(45deg, transparent 45%, #9333ea 45.25%, transparent 45.75%),
              linear-gradient(45deg, transparent 75%, #9333ea 75.25%, transparent 75.75%),
              linear-gradient(45deg, transparent 85%, #9333ea 85.25%, transparent 85.75%)
            `,
            backgroundSize: "300px 300px",
            animation: "diagonal-fall 20s linear infinite, fade-in 2s ease-out",
          }}
        />
        {/* Layer 2 - Medium length lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `
              linear-gradient(45deg, transparent 25%, #9333ea 25.25%, transparent 25.75%),
              linear-gradient(45deg, transparent 55%, #9333ea 55.25%, transparent 55.75%),
              linear-gradient(45deg, transparent 95%, #9333ea 95.25%, transparent 95.75%)
            `,
            backgroundSize: "300px 300px",
            animation: "diagonal-fall 15s linear infinite, fade-in 2s ease-out",
          }}
        />
        {/* Layer 3 - Long lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `
              linear-gradient(45deg, transparent 5%, #9333ea 5.25%, transparent 5.75%),
              linear-gradient(45deg, transparent 35%, #9333ea 35.25%, transparent 35.75%),
              linear-gradient(45deg, transparent 65%, #9333ea 65.25%, transparent 65.75%)
            `,
            backgroundSize: "300px 300px",
            animation: "diagonal-fall 25s linear infinite, fade-in 2s ease-out",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4">
        {/* Hero Section - removed justify-between from parent and added margin-top */}
        <div className="w-full max-w-5xl mx-auto text-center space-y-6 py-16 md:py-24 mt-8">
          <h1
            className={` text-purple-600 border py-1 md:py-4 border-blue-500 relative max-w-3xl mx-auto`}
          >
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
            <div className="flex flex-col gap-4 md:gap-6">
              <p
                className={`text-4xl md:text-7xl text-purple-500 ${climateCrisis.className}`}
              >
                Just Frame It
              </p>
              <p className="text-purple-500 font-semibold text-base md:text-xl">
                Build sprint to reframe the future of social feeds
              </p>
            </div>
          </h1>

          {/* Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs md:text-base font-bold text-purple-500">
            <div className="border-2 border-purple-500 px-6 py-2 md:px-8 md:py-3 bg-white/50">
              6 TEAMS
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 md:px-8 md:py-3 bg-white/50">
              HYBRID BUILDATHON
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 md:px-8 md:py-3 bg-white/50">
              ONLINE - NYC - ROME
            </div>
            <div className="border-2 border-purple-500 px-6 py-2 md:px-8 md:py-3 bg-white/50">
              APR 7TH - JUNE 7TH
            </div>
          </div>
        </div>

        {/* Apply Button Section - added margin-top auto to push it down */}
        <div className="w-full max-w-5xl mx-auto text-center pb-8 md:pb-16 mt-auto">
          {/* Learn More Link */}
          <button
            onClick={() => setIsProgramInfoModalOpen(true)}
            className="mb-4 md:mb-6 text-purple-600 text-base md:text-lg underline hover:text-purple-700 transition-colors duration-200"
          >
            Learn More
          </button>

          <div>
            <button
              onClick={handleApplyClick}
              disabled={isSigningIn}
              className="px-8 py-4 md:px-12 md:py-6 bg-purple-600 text-white text-xl md:text-2xl font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSigningIn ? "Connecting..." : "Apply Now"}
            </button>
            <p className="text-purple-500 mt-4 md:mt-6 text-xs md:text-sm">
              Applications closing in {countdown.days} days, {countdown.hours}{" "}
              hours, {countdown.minutes} minutes, {countdown.seconds} seconds
            </p>
          </div>
        </div>

        {/* Builders Garden logo */}
        <div className="w-full flex justify-center mb-8">
          <a
            href="https://builders.garden"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/builders-garden-logo.png"
              alt="Builders Garden"
              width={60}
              height={12}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* Update animation styles */}
      <style jsx global>{`
        @keyframes diagonal-fall {
          0% {
            transform: translate(-100%, -100%) rotate(-1deg);
          }
          100% {
            transform: translate(100%, 100%) rotate(-1deg);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.1;
          }
        }
      `}</style>

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
