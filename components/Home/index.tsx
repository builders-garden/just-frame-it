"use client";

import { useFarcasterUsers } from "@/hooks/use-farcaster-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { useProfile } from "@farcaster/auth-kit";
import sdk from "@farcaster/frame-sdk";
import { CircleCheck, Hourglass } from "lucide-react";
import { Climate_Crisis } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import ApplyModal from "../ApplyModal";
import Button from "../Button";
import { useFrame } from "../farcaster-provider";
import ProgramInfoModal from "../ProgramInfoModal";
import SafeAreaContainer from "../SafeAreaContainer";
import Sponsors from "../Sponsors";
import SuccessStories from "../SuccessStories";
import Teams from "../Teams";
import { Tooltip } from "../Tooltip";
import VoteModal from "../VoteModal";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

interface FarcasterUser {
  fid: number;
  username: string;
  pfp_url?: string;
}

// Group FIDs by team
const teamFids = Object.entries(ALLOWED_PROGRESS_UPDATE_FIDS).reduce(
  (acc, [fid, team]) => {
    if (team !== "Builders Garden") {
      if (!acc[team]) {
        acc[team] = [];
      }
      acc[team].push(fid);
    }
    return acc;
  },
  {} as Record<string, string[]>
);

// Get all FIDs except Builders Garden
const allFids = Object.entries(ALLOWED_PROGRESS_UPDATE_FIDS)
  .filter(([_, team]) => team !== "Builders Garden")
  .map(([fid]) => fid);

export default function Home() {
  const { context } = useFrame();
  const [isFrameAdded, setIsFrameAdded] = useState(context?.client.added);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const { profile } = useProfile();
  const { data: users } = useFarcasterUsers(allFids) as {
    data: FarcasterUser[] | undefined;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProgramInfoModalOpen, setIsProgramInfoModalOpen] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("gm@builders.garden");
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
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

      <div className="w-full relative z-10 flex flex-col items-center px-0 md:pb-0 justify-between gap-8 md:gap-0">
        <div className="w-full max-w-5xl mx-auto text-center space-y-4 py-8 md:pb-16 mt-4 md:mt-8">
          <h1
            className={`mx-4 md:mx-auto text-purple-600 border py-1 md:py-4 border-blue-500 relative max-w-3xl`}
          >
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white border border-blue-500 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
            <div className="flex flex-col gap-1 justify-center items-center px-4">
              <p
                className={`text-3xl md:text-7xl text-purple-500 ${climateCrisis.className}`}
              >
                Just Frame It
              </p>
              <p className="text-purple-500 font-semibold text-xs md:text-2xl">
                Build sprint to reframe the future of social feeds
              </p>
            </div>
          </h1>

          <div className="flex flex-row gap-2 justify-center items-center text-black text-center text-sm md:text-xl font-semibold">
            <p>MAR 31ST - JUNE 22ND</p>
            <p className="w-1 h-1 bg-black rounded-full"></p>
            <p>ONLINE - NYC - ROME</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-16">
          <Teams />

          <Sponsors />

          <SuccessStories />
        </div>

        <div className="w-full flex justify-center py-4 md:py-8 text-gray-400">
          <div className="flex flex-col items-center gap-8">
            <p className="text-sm text-center ">
              Any questions? <br />
              <span>
                <a
                  href="https://warpcast.com/limone.eth"
                  className="font-semibold"
                  target="_blank"
                >
                  limone.eth
                </a>
              </span>{" "}
              or{" "}
              <Tooltip content="Copied!" open={showCopiedTooltip}>
                <span
                  className="font-semibold cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={copyEmailToClipboard}
                >
                  gm@builders.garden
                </span>
              </Tooltip>
            </p>
            <div className="flex flex-row gap-8 justify-center items-center">
              <a
                href="https://builders.garden"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/builders-garden-logo.svg"
                  alt="Builders Garden"
                  width={90}
                  height={18}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                href="https://urbe.build"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/urbe-logo.svg"
                  alt="Urbe"
                  width={90}
                  height={18}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

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

      {isModalOpen && (
        <ApplyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isProgramInfoModalOpen && (
        <ProgramInfoModal
          isOpen={isProgramInfoModalOpen}
          onClose={() => setIsProgramInfoModalOpen(false)}
        />
      )}

      {isVoteModalOpen && (
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
        />
      )}

      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
          <div className="text-center p-6 rounded-lg">
            <div className="mb-4 text-purple-500">
              <Hourglass className="w-16 h-16 mx-auto" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Applications Coming Soon!
            </h3>
            <p className="text-gray-500 mb-6">
              Thank you for your interest! Applications are not open yet. Save
              the Frame, and you&apos;ll be the first to know when they open.
            </p>
            <div className="flex flex-col gap-2 justify-center items-center">
              <Button
                className="w-full"
                disabled={context?.client.added}
                onClick={async () => {
                  try {
                    await sdk.actions.addFrame();
                  } catch (error) {
                    console.error("Failed to save frame", error);
                  } finally {
                    setShowOverlay(false);
                  }
                }}
              >
                {context?.client.added || isFrameAdded ? (
                  <div className="flex flex-row items-center justify-center gap-2 border-none">
                    <CircleCheck className="inline" size={24} />
                    Frame Already Saved{" "}
                  </div>
                ) : (
                  "Save Frame"
                )}
              </Button>
              <Button
                className="w-full"
                onClick={() => setShowOverlay(false)}
                variant="bordered"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </SafeAreaContainer>
  );
}
