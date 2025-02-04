"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Climate_Crisis } from "next/font/google";
import { useMe } from "@/hooks/use-users";
import { useSearchUsers } from "@/hooks/use-users";
import { useProfile } from "@farcaster/auth-kit";
import Image from "next/image";
import { useApply } from "@/hooks/use-apply";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });
interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ApplyFormData {
  teamMembers: Array<{
    fid: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }>;
  projectName: string;
  projectDescription: string;
  whyAttend: string;
  previousWork: string;
  githubUrl: string;
  canAttendRome: boolean;
  creatorDisplayName: string;
  creatorUsername: string;
  creatorAvatarUrl?: string;
}

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const { data: user } = useMe();
  const { isAuthenticated, profile } = useProfile();
  const { mutateAsync: apply, isPending } = useApply();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [whyAttend, setWhyAttend] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    Array<{
      fid: number;
      username: string;
      displayName: string;
      pfp_url?: string;
    }>
  >([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [canAttendRome, setCanAttendRome] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: searchResults, isLoading: isSearching } =
    useSearchUsers(searchQuery);

  const validateForm = (): boolean => {
    if (!projectName.trim()) {
      setValidationError("Project name is required");
      return false;
    }
    if (!projectDescription.trim()) {
      setValidationError("Project description is required");
      return false;
    }
    if (!whyAttend.trim()) {
      setValidationError("Please explain why you want to participate");
      return false;
    }
    if (!githubUrl.trim()) {
      setValidationError("GitHub URL is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setIsSubmitting(true);

    try {
      const data: ApplyFormData = {
        teamMembers: selectedTeamMembers.map((member) => ({
          fid: member.fid,
          username: member.username,
          displayName: member.displayName,
          avatarUrl: member.pfp_url,
        })),
        projectName: projectName.trim(),
        projectDescription: projectDescription.trim(),
        whyAttend: whyAttend.trim(),
        previousWork: previousWork.trim(),
        creatorUsername: isAuthenticated ? profile.username! : user?.username!,
        creatorDisplayName: isAuthenticated
          ? profile.displayName!
          : user?.display_name!,
        creatorAvatarUrl: isAuthenticated ? profile.pfpUrl : user?.pfp_url,
        githubUrl: githubUrl.trim(),
        canAttendRome: canAttendRome,
      };

      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      await apply(data, {
        onSuccess: () => {
          setShowSuccess(true);
          // Close modal after showing success message for 2 seconds
          setTimeout(() => {
            setShowSuccess(false);
            onClose();
          }, 5000);
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
          setValidationError("Something went wrong. Please try again.");
        },
      });
    } catch (error) {
      setValidationError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
      setProjectDescription("");
      setWhyAttend("");
      setPreviousWork("");
      setSelectedTeamMembers([]);
      setValidationError(null);
      setGithubUrl("");
      setCanAttendRome(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex min-h-screen items-start justify-center bg-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 w-full min-h-screen max-w-5xl  p-6 text-left align-middle relative"
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

                <div className="flex flex-row gap-1 items-center text-purple-600">
                  <p className="text-lg font-medium">Apply to</p>
                  <p
                    className={`text-purple-600 text-xl font-bold ${climateCrisis.className}`}
                  >
                    Just Frame It
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        disabled
                        value={
                          isAuthenticated ? profile.username : user?.username
                        }
                        className="block w-full border border-gray-300 px-3 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      />
                      {isAuthenticated && profile.pfpUrl ? (
                        <Image
                          src={profile.pfpUrl}
                          alt={"profile pfp"}
                          width={24}
                          height={24}
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                          placeholder="empty"
                        />
                      ) : (
                        <Image
                          src={user?.pfp_url!}
                          alt={user?.username!}
                          width={24}
                          height={24}
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                          placeholder="empty"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="githubUrl"
                      className="block text-sm font-medium text-gray-700"
                    >
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="projectName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Your project name..."
                        className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You can submit an existing project or a new idea
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="projectDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Description
                      </label>
                      <textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        rows={3}
                        placeholder="Describe your project idea..."
                        className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Who are you building with?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        disabled={selectedTeamMembers.length >= 2}
                        className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {searchQuery && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="px-4 py-2 text-gray-500">
                              Searching...
                            </div>
                          ) : searchResults &&
                            searchResults &&
                            searchResults.users.length > 0 ? (
                            searchResults.users.map((user) => (
                              <div
                                key={user.username}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                  if (
                                    !selectedTeamMembers.find(
                                      (member) =>
                                        member.username === user.username
                                    ) &&
                                    selectedTeamMembers.length < 2
                                  ) {
                                    setSelectedTeamMembers([
                                      ...selectedTeamMembers,
                                      {
                                        fid: Number(user.fid),
                                        username: user.username,
                                        displayName: user.display_name,
                                        pfp_url: user.pfp_url,
                                      },
                                    ]);
                                    setSearchQuery("");
                                  }
                                }}
                              >
                                {user.pfp_url && (
                                  <Image
                                    src={user.pfp_url}
                                    alt={user.username}
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 rounded-full"
                                    placeholder="empty"
                                  />
                                )}
                                {user.username}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No users found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      {selectedTeamMembers.map((member) => (
                        <div
                          key={member.username}
                          className="bg-purple-100 px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          {member.pfp_url && (
                            <Image
                              src={member.pfp_url}
                              alt={member.username}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full"
                              placeholder="empty"
                            />
                          )}
                          <span>{member.username}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTeamMembers(
                                selectedTeamMembers.filter(
                                  (m) => m.username !== member.username
                                )
                              )
                            }
                            className="text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {selectedTeamMembers.length < 2 && (
                        <div className="text-xs text-gray-500">
                          You can add up to {2 - selectedTeamMembers.length}{" "}
                          more team member
                          {2 - selectedTeamMembers.length === 1 ? "" : "s"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="whyAttend"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Why do you want to participate?
                    </label>
                    <textarea
                      id="whyAttend"
                      value={whyAttend}
                      onChange={(e) => setWhyAttend(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="previousWork"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Share links to Frames or projects you&apos;ve built
                      (optional)
                    </label>
                    <textarea
                      id="previousWork"
                      value={previousWork}
                      onChange={(e) => setPreviousWork(e.target.value)}
                      rows={3}
                      placeholder="Share links to your Frames, projects, or describe your previous work..."
                      className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="flex items-center h-5">
                      <input
                        id="canAttendRome"
                        type="checkbox"
                        checked={canAttendRome}
                        onChange={(e) => setCanAttendRome(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-2">
                      <label
                        htmlFor="canAttendRome"
                        className="text-sm font-medium text-gray-700"
                      >
                        I can attend the Rome residency (May 31st - June 6th,
                        2025)
                      </label>
                      <p className="text-xs text-gray-500">
                        Top 3 teams will be invited to a week-long build
                        residency in Rome (expenses covered)
                      </p>
                    </div>
                  </div>

                  {validationError && (
                    <div className="text-red-500 text-sm">
                      {validationError}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {(isSubmitting || isPending) && (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isSubmitting || isPending
                        ? "Submitting..."
                        : "Submit Application"}
                    </button>
                  </div>
                </form>

                {showSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                    <div className="text-center p-6 rounded-lg">
                      <div className="mb-4 text-green-500">
                        <svg
                          className="w-16 h-16 mx-auto"
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
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Application Submitted!
                      </h3>
                      <p className="text-gray-500">
                        Thank you for applying. We&apos;ll review your
                        application soon.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
