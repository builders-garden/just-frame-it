import { TeamMember } from "@/components/TeamMember";
import { useApplications } from "@/hooks/use-applications";
import { useSubmitVote } from "@/hooks/use-votes";
import { ALLOWED_VOTER_FIDS } from "@/lib/constants";
import { CircularProgress, Slider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useWalletClient } from "wagmi";
import { useFrame } from "./farcaster-provider";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoteModal({ isOpen, onClose }: VoteModalProps) {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"not-voted" | "voted">(
    "not-voted"
  );
  const [votesMap, setVotesMap] = useState<
    Record<string, { experience: number; idea: number; virality: number }>
  >({});
  const [lastVotedId, setLastVotedId] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [expandedWhyAttend, setExpandedWhyAttend] = useState<
    Record<string, boolean>
  >({});
  const [expandedPreviousWork, setExpandedPreviousWork] = useState<
    Record<string, boolean>
  >({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const limit = 100;
  const { context } = useFrame();
  const { data: walletClient } = useWalletClient();
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useApplications({
    page,
    limit,
  });

  const { mutate: submitVote, isPending: isSubmittingVote } = useSubmitVote();

  const scrollToTop = () => {
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    scrollToTop();
  };

  const handleNext = (maxIndex: number, afterVote: boolean = false) => {
    if (!afterVote) {
      setCurrentIndex((prev) => Math.min(maxIndex - 1, prev + 1));
    } else {
      setCurrentIndex(0);
    }
    scrollToTop();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        const filteredApps =
          applicationsData?.applications.filter((app) =>
            activeTab === "voted"
              ? app?.votes?.some(
                  (v) =>
                    v.applicationId === app.id &&
                    v.voterFid === context?.user?.fid
                )
              : !app?.votes?.every(
                  (v) =>
                    v.applicationId === app.id &&
                    v.voterFid !== context?.user?.fid
                )
          ) || [];
        handleNext(filteredApps.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, applicationsData?.applications, context?.user?.fid]);

  if (!isOpen) return null;

  if (!context?.user?.fid || !ALLOWED_VOTER_FIDS.includes(context?.user?.fid)) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="max-w-2xl w-full mx-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600">
              You are not authorized to vote on applications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleVoteChange = (
    applicationId: string,
    field: "experience" | "idea" | "virality",
    value: number
  ) => {
    setVotesMap((prev) => {
      const existingVote = applicationsData?.applications
        .find((app) => app.id === applicationId)
        ?.votes.find((v) => v.voterFid === context?.user?.fid);
      const currentValues = prev[applicationId] ||
        existingVote || { experience: 1, idea: 1, virality: 1 };

      return {
        ...prev,
        [applicationId]: {
          ...currentValues,
          [field]: value,
        },
      };
    });
  };

  const handleSliderChange = (
    applicationId: string,
    field: "experience" | "idea" | "virality",
    _event: Event,
    value: number | number[]
  ) => {
    handleVoteChange(applicationId, field, value as number);
  };

  const handleSubmitVote = async (applicationId: string) => {
    const vote = votesMap[applicationId];
    if (!vote || !vote.experience || !vote.idea || !vote.virality) return;

    try {
      const message = `I confirm my vote for application ${applicationId} with scores: Experience=${vote.experience}, Idea=${vote.idea}, Virality=${vote.virality}`;
      const signature = await walletClient?.signMessage({
        message,
      });

      if (!signature) {
        throw new Error("Failed to sign message");
      }

      await submitVote({
        applicationId,
        ...vote,
        signature: signature!,
        message,
      });

      // Clear the vote from the votesMap
      setVotesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[applicationId];
        return newMap;
      });

      setLastVotedId(applicationId);

      // Wait a short moment before refetching to ensure the backend has processed the vote
      await new Promise((resolve) => setTimeout(resolve, 500));
      await refetchApplications();

      // Get the current filtered apps after refetch
      const filteredApps =
        applicationsData?.applications.filter(
          (app) =>
            !app.votes?.some(
              (v) =>
                v.applicationId === app.id && v.voterFid === context?.user?.fid
            )
        ) || [];

      // If there are more applications to vote on, move to the next one
      if (currentIndex < filteredApps.length - 1) {
        handleNext(filteredApps.length, true);
      } else if (filteredApps.length > 0) {
        // If we're at the last index but there are still apps, reset to the first one
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Failed to submit vote:", error);
      alert("Failed to submit vote. Please try again.");
    }
  };

  const toggleDescription = (appId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const toggleWhyAttend = (appId: string) => {
    setExpandedWhyAttend((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const togglePreviousWork = (appId: string) => {
    setExpandedPreviousWork((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const truncateText = (text: string, isExpanded: boolean) => {
    if (isExpanded) return text;
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  const calculateTotal = (vote: {
    experience: number;
    idea: number;
    virality: number;
  }) => {
    const exp = Number(vote.experience) || 0;
    const idea = Number(vote.idea) || 0;
    const vir = Number(vote.virality) || 0;
    return exp + idea + vir;
  };

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      {isSubmittingVote && (
        <div className="fixed inset-0 bg-purple-500/30 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <CircularProgress sx={{ color: "white" }} />
            <Typography className="text-white font-medium">
              Submitting your vote...
            </Typography>
          </div>
        </div>
      )}
      <div className="max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Vote on Applications</h1>
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

        {applicationsData && (
          <div className="text-sm text-gray-600 mb-4">
            <span>{applicationsData.total} total applications</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("not-voted")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "not-voted"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Not Voted Yet
            </button>
            <button
              onClick={() => setActiveTab("voted")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "voted"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Already Voted
            </button>
          </div>
        </div>

        {isLoadingApplications ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : applicationsData?.applications?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No applications have been submitted yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Not Voted Applications Tab */}
            {activeTab === "not-voted" && (
              <div className="space-y-6">
                {(() => {
                  const filteredApps =
                    applicationsData?.applications.filter(
                      (app) =>
                        !app.votes?.some(
                          (v) =>
                            v.applicationId === app.id &&
                            v.voterFid === context?.user?.fid
                        )
                    ) || [];

                  if (filteredApps.length === 0) return null;

                  const app = filteredApps[currentIndex];
                  const currentVote = votesMap[app.id] || {
                    experience: 1,
                    idea: 1,
                    virality: 1,
                  };

                  return (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <button
                          onClick={() => handlePrevious()}
                          disabled={currentIndex === 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Previous
                        </button>
                        <span className="text-gray-600">
                          Application {currentIndex + 1} of{" "}
                          {filteredApps.length}
                        </span>
                        <button
                          onClick={() => handleNext(filteredApps.length)}
                          disabled={currentIndex === filteredApps.length - 1}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === filteredApps.length - 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          Next
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>

                      <div
                        key={app.id}
                        className="border rounded-lg p-6 shadow-sm flex flex-col"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col items-start gap-4">
                            <div className="flex flex-row items-center gap-2">
                              <h2 className="text-xl font-semibold break-words">
                                {app.projectName}
                              </h2>
                              {app.githubUrl && (
                                <a
                                  href={app.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </a>
                              )}
                            </div>
                            <div className="flex flex-row gap-4 shrink-0">
                              <TeamMember
                                username={app.teamMember1Username}
                                displayName={app.teamMember1DisplayName}
                                avatarUrl={
                                  app.teamMember1AvatarUrl ?? undefined
                                }
                                mode="vertical"
                              />
                              {app.teamMember2Username && (
                                <TeamMember
                                  username={app.teamMember2Username}
                                  displayName={app.teamMember2DisplayName ?? ""}
                                  avatarUrl={
                                    app.teamMember2AvatarUrl ?? undefined
                                  }
                                  mode="vertical"
                                />
                              )}
                              {app.teamMember3Username && (
                                <TeamMember
                                  username={app.teamMember3Username}
                                  displayName={app.teamMember3DisplayName ?? ""}
                                  avatarUrl={
                                    app.teamMember3AvatarUrl ?? undefined
                                  }
                                  mode="vertical"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Project Description
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.projectDescription,
                                  expandedDescriptions[app.id] || false
                                )}
                              </p>
                              {app.projectDescription.length > 120 && (
                                <button
                                  onClick={() => toggleDescription(app.id)}
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                >
                                  {expandedDescriptions[app.id]
                                    ? "Show Less"
                                    : "Show More"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Reason to attend
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.whyAttend,
                                  expandedWhyAttend[app.id] || false
                                )}
                              </p>
                              {app.whyAttend.length > 120 && (
                                <button
                                  onClick={() => toggleWhyAttend(app.id)}
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                >
                                  {expandedWhyAttend[app.id]
                                    ? "Show Less"
                                    : "Show More"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Previous Work
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.previousWork,
                                  expandedPreviousWork[app.id] || false
                                )}
                              </p>
                              {app.previousWork &&
                                app.previousWork.length > 120 && (
                                  <button
                                    onClick={() => togglePreviousWork(app.id)}
                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                  >
                                    {expandedPreviousWork[app.id]
                                      ? "Show Less"
                                      : "Show More"}
                                  </button>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Can attend in Rome?
                            </label>
                            <p className="text-gray-600">
                              {app.canAttendRome ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px] border-t-2 border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700"
                            >
                              Total Points
                            </Typography>
                            <Typography
                              variant="h6"
                              className="text-blue-600 font-semibold"
                            >
                              {calculateTotal(currentVote)}/15
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Experience (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.experience}
                              </Typography>
                              <Slider
                                value={currentVote.experience}
                                onChange={(e, value) =>
                                  handleSliderChange(
                                    app.id,
                                    "experience",
                                    e,
                                    value
                                  )
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Idea (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.idea}
                              </Typography>
                              <Slider
                                value={currentVote.idea}
                                onChange={(e, value) =>
                                  handleSliderChange(app.id, "idea", e, value)
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Virality (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.virality}
                              </Typography>
                              <Slider
                                value={currentVote.virality}
                                onChange={(e, value) =>
                                  handleSliderChange(
                                    app.id,
                                    "virality",
                                    e,
                                    value
                                  )
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleSubmitVote(app.id)}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
                          >
                            Submit Vote
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => handlePrevious()}
                          disabled={currentIndex === 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Previous
                        </button>
                        <button
                          onClick={() => handleNext(filteredApps.length)}
                          disabled={currentIndex === filteredApps.length - 1}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === filteredApps.length - 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          Next
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Voted Applications Tab */}
            {activeTab === "voted" && (
              <div className="space-y-6">
                {(() => {
                  const filteredApps =
                    applicationsData?.applications.filter((app) =>
                      app.votes?.some(
                        (v) =>
                          v.applicationId === app.id &&
                          v.voterFid === context?.user?.fid
                      )
                    ) || [];

                  if (filteredApps.length === 0) return null;

                  const app = filteredApps[currentIndex];
                  const existingVote = app?.votes?.find(
                    (v) =>
                      v.applicationId === app.id &&
                      v.voterFid === context?.user?.fid
                  );
                  const currentVote = votesMap[app.id] ||
                    existingVote || { experience: 1, idea: 1, virality: 1 };

                  return (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <button
                          onClick={() => handlePrevious()}
                          disabled={currentIndex === 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Previous
                        </button>
                        <span className="text-gray-600">
                          Application {currentIndex + 1} of{" "}
                          {filteredApps.length}
                        </span>
                        <button
                          onClick={() => handleNext(filteredApps.length)}
                          disabled={currentIndex === filteredApps.length - 1}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            currentIndex === filteredApps.length - 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          Next
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>

                      <div
                        key={app.id}
                        className="border rounded-lg p-6 shadow-sm flex flex-col bg-gray-50"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col items-start gap-4">
                            <div className="flex flex-row items-center gap-2">
                              <h2 className="text-xl font-semibold break-words">
                                {app.projectName}
                              </h2>
                              {app.githubUrl && (
                                <a
                                  href={app.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </a>
                              )}
                            </div>
                            <div className="flex flex-row gap-4 shrink-0">
                              <TeamMember
                                username={app.teamMember1Username}
                                displayName={app.teamMember1DisplayName}
                                avatarUrl={
                                  app.teamMember1AvatarUrl ?? undefined
                                }
                                mode="vertical"
                              />
                              {app.teamMember2Username && (
                                <TeamMember
                                  username={app.teamMember2Username}
                                  displayName={app.teamMember2DisplayName ?? ""}
                                  avatarUrl={
                                    app.teamMember2AvatarUrl ?? undefined
                                  }
                                  mode="vertical"
                                />
                              )}
                              {app.teamMember3Username && (
                                <TeamMember
                                  username={app.teamMember3Username}
                                  displayName={app.teamMember3DisplayName ?? ""}
                                  avatarUrl={
                                    app.teamMember3AvatarUrl ?? undefined
                                  }
                                  mode="vertical"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Project Description
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.projectDescription,
                                  expandedDescriptions[app.id] || false
                                )}
                              </p>
                              {app.projectDescription.length > 120 && (
                                <button
                                  onClick={() => toggleDescription(app.id)}
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                >
                                  {expandedDescriptions[app.id]
                                    ? "Show Less"
                                    : "Show More"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Reason to attend
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.whyAttend,
                                  expandedWhyAttend[app.id] || false
                                )}
                              </p>
                              {app.whyAttend.length > 120 && (
                                <button
                                  onClick={() => toggleWhyAttend(app.id)}
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                >
                                  {expandedWhyAttend[app.id]
                                    ? "Show Less"
                                    : "Show More"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Previous Work
                            </label>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                {truncateText(
                                  app.previousWork,
                                  expandedPreviousWork[app.id] || false
                                )}
                              </p>
                              {app.previousWork &&
                                app.previousWork.length > 120 && (
                                  <button
                                    onClick={() => togglePreviousWork(app.id)}
                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                                  >
                                    {expandedPreviousWork[app.id]
                                      ? "Show Less"
                                      : "Show More"}
                                  </button>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-400">
                              Can attend in Rome?
                            </label>
                            <p className="text-gray-600">
                              {app.canAttendRome ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px] border-t-2 border-gray-200 pt-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                            <div className="flex items-center gap-2 text-green-700">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                You have already voted on this application
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700"
                            >
                              Total Points
                            </Typography>
                            <Typography
                              variant="h6"
                              className="text-blue-600 font-semibold"
                            >
                              {calculateTotal(currentVote)}/15
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Experience (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.experience}
                              </Typography>
                              <Slider
                                value={currentVote.experience}
                                onChange={(e, value) =>
                                  handleSliderChange(
                                    app.id,
                                    "experience",
                                    e,
                                    value
                                  )
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                              />
                            </div>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Idea (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.idea}
                              </Typography>
                              <Slider
                                value={currentVote.idea}
                                onChange={(e, value) =>
                                  handleSliderChange(app.id, "idea", e, value)
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                              />
                            </div>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-gray-700 mb-1"
                            >
                              Virality (1-5)
                            </Typography>
                            <div className="flex items-center gap-4">
                              <Typography className="w-8 text-center">
                                {currentVote.virality}
                              </Typography>
                              <Slider
                                value={currentVote.virality}
                                onChange={(e, value) =>
                                  handleSliderChange(
                                    app.id,
                                    "virality",
                                    e,
                                    value
                                  )
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleSubmitVote(app.id)}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
                          >
                            Update Vote
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
