import { motion, AnimatePresence } from "framer-motion";
import { Climate_Crisis } from "next/font/google";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

interface ProgramInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full h-full bg-white p-8 overflow-y-auto relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
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

              <div className="flex flex-row items-center gap-2">
                <p className="text-2xl font-bold text-purple-600 mb-4">About</p>
                <p
                  className={`${climateCrisis.className} text-2xl font-bold text-purple-600 mb-4`}
                >
                  Just Frame It
                </p>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>
                  <span className=" text-purple-500">Just Frame It</span> is a
                  two-month builder program designed to empower developers,
                  product creators, and founders to build Frames on Farcaster.
                  Frames are a way to build interactive apps that run directly
                  in a Farcaster social feed. By leveraging Warpcast&apos;s
                  engaged user base, Frames offer a simplified distribution
                  model and significantly reduced development costs.
                </p>

                <div className="space-y-2">
                  <h3 className="font-bold text-purple-600">
                    Program Structure:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>6 teams with up to 3 builders each</li>
                    <li>
                      Online collaboration & mentorship with experienced
                      builders
                    </li>
                    <li>Biweekly demo days with live-streamed presentations</li>
                    <li>
                      Mid-program meetup in NYC during Farcon NYC (optional)
                    </li>
                    <li>Build residency in Rome for top 3 teams</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-purple-600">Timeline:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Applications Open: February 17, 2025</li>
                    <li>Applications Close: March 16, 2025</li>
                    <li>Selected Builders Announced: April 1, 2025</li>
                    <li>Program Start: April 7, 2025</li>
                    <li>NYC Meetup: May 1-4, 2025</li>
                    <li>Rome Residency: May 31 - June 6, 2025</li>
                    <li>Final Demo Day: June 7, 2025</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-purple-600">Organized by:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <a
                        href="https://builders.garden"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-purple-600"
                      >
                        Builders Garden
                      </a>{" "}
                      - A consumer crypto product studio, building on Farcaster
                      for over a year and creators of Farville
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
                      organizers of ETHRome Hackathon, hosting Italy&apos;s only
                      Web3 hub
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
