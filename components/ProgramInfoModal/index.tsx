import { AnimatePresence, motion } from "framer-motion";
import { Climate_Crisis } from "next/font/google";
import Image from "next/image";
import Mentors from "../Mentors";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

interface ProgramInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MentorInfo {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

const mentors: MentorInfo[] = [
  {
    displayName: "limone.eth",
    username: "limone.eth",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3acd1b12-0a6e-4370-ee6b-d81d3d717600/original",
    bio: "Farville, Builders Garden, urbe.eth",
  },
  {
    displayName: "Frank",
    username: "frankk",
    avatarUrl: "https://i.imgur.com/HLk7cUL.jpg",
    bio: "Farville, Builders Garden, urbe.eth",
  },
  {
    displayName: "horsefacts",
    username: "horsefacts.eth",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/4de344b2-ad81-457c-ca5d-a235438d7700/original",
    bio: "Farcaster, Warpcast, Yoink",
  },
  {
    displayName: "Linda Xie",
    username: "linda",
    avatarUrl:
      "https://i.seadn.io/gae/r6CW_kgQygQhI7-4JdWt_Nbf_bjFNnEM7dSns1nZGrijJvUMaLnpAFuBLwjsHXTkyX8zfgpRJCYibtm7ojeA2_ASQwSJgh7yKEFVMOI?w=500&auto=format",
    bio: "Farcaster, Warpcast, Bountycaster",
  },
  {
    displayName: "Stephan",
    username: "stephancill",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/d856be72-5b5a-4423-d6ba-8eded0978e00/rectcrop3",
    bio: "Frames.js, Yo, irl, Larry",
  },
  {
    displayName: "Samuel ツ",
    username: "samuellhuber.eth",
    avatarUrl: "https://i.imgur.com/OHMozjv.jpg",
    bio: "dTech Vision",
  },
  {
    displayName: "Matthew Fox",
    username: "matthewfox",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5be0ee5e-9000-455f-b20a-4b651f553400/original",
    bio: "Clankermon, FC Trivia, Jeeves",
  },
  {
    displayName: "Chintan Turakhia",
    username: "chintan",
    avatarUrl:
      "https://i.seadn.io/gae/j1lh_bdmLxwRcCbk8OS7xHWcMlQXWfv_MTZF5nMBdg9MvSSseeAtfQ4rdEgASTAN8lT7kk-mN8H5dm4uAidlrHA5vWva3nKdCnqZ?w=500&auto=format",
    bio: "Coinbase Wallet",
  },
  {
    displayName: "eric.base.eth🔵",
    username: "ericbrown.eth",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bd38e921-a5f7-418b-3fab-9fb6a7dfd400/original",
    bio: "Base",
  },
  {
    displayName: "wbnns.base.eth🔵",
    username: "wbnns",
    avatarUrl:
      "https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/25fac8e0-0bbb-4127-5a47-4a81e03d7100/anim=false,fit=contain,f=auto,w=336",
    bio: "Base",
  },
  {
    displayName: "will",
    username: "w",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1457405137085894659/N1iYPAc9_400x400.jpg",
    bio: "Splits",
  },
  {
    displayName: "abram",
    username: "jared.eth",
    avatarUrl:
      "https://warpcast.com/abram",
    bio: "Base",
  },
  {
    displayName: "tldr (tim reilly)",
    username: "tldr",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1d3c1cdd-db51-481d-4da2-c438b910b000/rectcrop3",
    bio: "Bracket, Bracky",
  },
  {
    displayName: "Daniel",
    username: "pirosb3",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7229dfa5-4873-42d0-9dd0-69f4f3fc4d00/original",
    bio: "Bountycaster",
  },
  {
    displayName: "Chris Carella",
    username: "ccarella.eth",
    avatarUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/06f8c85d-fc77-4e76-91bf-6f3063bda400/rectcrop3",
    bio: "Scout Game, Purple DAO",
  },
];

const timelineEvents = [
  { title: "Applications Open", date: "February 17th, 2025" },
  { title: "Applications Close", date: "March 16th, 2025" },
  { title: "Program Start", date: "March 31st, 2025" },
  { title: "NYC Meetup", date: "May 1-4th, 2025" },
  { title: "Program Ends", date: "May 23rd, 2025" },
  { title: "Rome Residency", date: "June 14th - 22nd, 2025" },
  { title: "Final Demo Day", date: "June 22nd, 2025" },
];

export default function ProgramInfoModal({
  isOpen,
  onClose,
}: ProgramInfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50"
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="min-h-screen bg-white"
            >
              <div className="max-w-5xl mx-auto p-4 sm:p-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                      About
                    </p>
                    <p
                      className={`${climateCrisis.className} text-2xl sm:text-3xl font-bold text-purple-600`}
                    >
                      Just Frame It
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className=" text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6 text-gray-700">
                  <div className="space-y-2">
                    <p className="text-lg leading-relaxed">
                      <span className="text-purple-500 font-semibold">
                        Just Frame It
                      </span>{" "}
                      is a two-month builder program designed to empower
                      developers, product creators, and founders to build{" "}
                      <span className="text-purple-500 font-semibold">
                        <a
                          href="https://docs.farcaster.xyz/developers/frames/v2/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Frames
                        </a>
                      </span>{" "}
                      on Farcaster. Frames are a way to build interactive apps
                      that run directly in a Farcaster social feed. By
                      leveraging Warpcast&apos;s engaged user base, Frames offer
                      a simplified distribution model and significantly reduced
                      development costs.
                    </p>
                    <p className="text-xs text-purple-500">
                      <a
                        href="https://docs.farcaster.xyz/developers/frames/v2/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        What is a Frame →
                      </a>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-purple-600">
                      Program Structure:
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-lg">
                      <li>6 teams with up to 3 builders each</li>
                      <li>
                        Online collaboration & mentorship with experienced
                        builders
                      </li>
                      <li>
                        Biweekly live-streamed demo days with judges voting
                      </li>
                      <li>
                        Mid-program meetup in NYC during{" "}
                        <span className="text-purple-600 font-semibold">
                          <a
                            href="https://farcon.nyc"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Farcon NYC
                          </a>
                        </span>{" "}
                        (optional to attend)
                      </li>
                      <li>
                        Build residency in Rome for top 3 teams (expenses
                        covered)
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                      <strong>Important:</strong> All projects submitted to Just
                      Frame It are required to build and deploy on Base.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-purple-600">
                        Timeline:
                      </h3>
                      <a
                        href="https://builders-garden.notion.site/Timeline-199679ed099e808aaf23ed1d1843de2c?pvs=4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-500  hover:underline font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        More details →
                      </a>
                    </div>

                    {/* Mobile Timeline (Vertical) */}
                    <div className="block sm:hidden relative pl-8 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
                      {timelineEvents.map((event) => (
                        <div key={event.title} className="relative">
                          <div className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-purple-600 bg-white"></div>
                          <div>
                            <h4 className="font-semibold text-purple-600">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {event.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Timeline (Horizontal) */}
                    <div className="hidden sm:block relative py-32">
                      {/* Main horizontal line */}
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-purple-200"></div>

                      {/* Timeline events */}
                      <div className="grid grid-cols-7">
                        {timelineEvents.map((event, index) => (
                          <div key={event.title} className="relative">
                            {/* Circle marker */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-purple-600 bg-white z-10"></div>

                            {/* Content container */}
                            <div
                              className={`absolute left-1/2 -translate-x-1/2 w-full ${
                                index % 2 === 0
                                  ? "bottom-full mb-4"
                                  : "top-full mt-4"
                              }`}
                            >
                              <div className="text-center">
                                <h4 className="font-semibold text-purple-600 text-base mb-1">
                                  {event.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {event.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Mentors />

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-purple-600">
                      Organized by:
                    </h3>
                    <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base">
                      <li>
                        <a
                          href="https://builders.garden"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-purple-600"
                        >
                          Builders Garden
                        </a>{" "}
                        - A consumer crypto product studio, building on
                        Farcaster for over a year and creators of Farville
                      </li>
                      <li>
                        <a
                          href="https://urbe.build"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-purple-600"
                        >
                          urbe.eth
                        </a>{" "}
                        - The leading Italian community for web3 builders,
                        organizers of ETHRome Hackathon, hosting Italy&apos;s
                        only Web3 hub
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-lg font-medium"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
