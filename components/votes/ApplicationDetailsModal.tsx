import { TeamMember } from "@/components/TeamMember";
import { Application, Vote } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type ApplicationWithScores = Application & {
  votes: Vote[];
  totalScore: number;
  voteCount: number;
};

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationWithScores;
  farcasterUsers: { fid: string; pfp_url: string }[];
}

export function ApplicationDetailsModal({
  isOpen,
  onClose,
  application,
  farcasterUsers,
}: ApplicationDetailsModalProps) {
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
                  <h2 className="text-2xl font-bold">Application Details</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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

                <div className="border rounded-lg p-6 shadow-sm">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Project Name
                      </h3>
                      <p className="text-gray-600">{application.projectName}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Project Description
                      </h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {application.projectDescription}
                      </p>
                    </div>

                    {application.previousWork && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Previous Work
                        </h3>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {application.previousWork}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Team Members
                      </h3>
                      <div className="flex flex-col gap-4">
                        <TeamMember
                          username={application.teamMember1Username}
                          displayName={application.teamMember1DisplayName}
                          avatarUrl={
                            application.teamMember1AvatarUrl ?? undefined
                          }
                        />
                        {application.teamMember2Username && (
                          <TeamMember
                            username={application.teamMember2Username}
                            displayName={
                              application.teamMember2DisplayName ?? ""
                            }
                            avatarUrl={
                              application.teamMember2AvatarUrl ?? undefined
                            }
                          />
                        )}
                        {application.teamMember3Username && (
                          <TeamMember
                            username={application.teamMember3Username}
                            displayName={
                              application.teamMember3DisplayName ?? ""
                            }
                            avatarUrl={
                              application.teamMember3AvatarUrl ?? undefined
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Why Attend</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {application.whyAttend}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Total Score
                        </h3>
                        <p className="text-gray-600">
                          {application.totalScore}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Vote Count
                        </h3>
                        <p className="text-gray-600">{application.voteCount}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Attendance
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            application.canAttendRome
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {application.canAttendRome
                            ? "Can Attend"
                            : "Cannot Attend"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Average Scores
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">
                            Experience
                          </p>
                          <p className="text-lg font-semibold">
                            {(
                              application.votes.reduce(
                                (acc, vote) => acc + vote.experience,
                                0
                              ) / application.voteCount
                            ).toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Idea</p>
                          <p className="text-lg font-semibold">
                            {(
                              application.votes.reduce(
                                (acc, vote) => acc + vote.idea,
                                0
                              ) / application.voteCount
                            ).toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Virality</p>
                          <p className="text-lg font-semibold">
                            {(
                              application.votes.reduce(
                                (acc, vote) => acc + vote.virality,
                                0
                              ) / application.voteCount
                            ).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Voters</h3>
                      <div className="flex flex-wrap gap-2">
                        {application.votes.map((vote) => {
                          const user = farcasterUsers.find(
                            (u) => u.fid.toString() === vote.voterFid.toString()
                          );
                          return (
                            <div
                              key={vote.id}
                              className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              {user?.pfp_url ? (
                                <Image
                                  src={user.pfp_url}
                                  alt={`Voter ${vote.voterFid}`}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-900">
                                  FID: {vote.voterFid}
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                Score:{" "}
                                {vote.experience + vote.idea + vote.virality}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
