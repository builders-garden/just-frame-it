"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Climate_Crisis } from "next/font/google";
import { useFrame } from "../farcaster-provider";
import { useMe } from "@/hooks/use-users";
import { useSearchUsers } from "@/hooks/use-users";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });
interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplyFormData) => void;
  isLoading: boolean;
}

export interface ApplyFormData {
  name: string;
  teamMembers: string[];
  projectName: string;
  whyAttend: string;
  projectDescription: string;
  previousWork: string;
}

export default function ApplyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ApplyModalProps) {
  const { data: user } = useMe();
  const { context } = useFrame();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasProjectIdea, setHasProjectIdea] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    Array<{
      username: string;
      pfp_url?: string;
    }>
  >([]);

  const { data: searchResults, isLoading: isSearching } =
    useSearchUsers(searchQuery);

  console.log("Search results:", searchResults);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  console.log(context?.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: ApplyFormData = {
      name: formData.get("name") as string,
      teamMembers: selectedTeamMembers.map((member) => member.username),
      projectName: hasProjectIdea
        ? (formData.get("projectName") as string)
        : "",
      projectDescription: hasProjectIdea
        ? (formData.get("projectDescription") as string)
        : "",
      whyAttend: formData.get("whyAttend") as string,
      previousWork: formData.get("previousWork") as string,
    };

    onSubmit(data);
  };

  console.log(searchResults);

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
            <div className="flex min-h-screen items-start justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 w-full min-h-screen bg-white p-6 text-left align-middle shadow-xl relative"
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
                  <div>
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
                        value={user?.username}
                        className="block w-full border border-gray-300 px-3 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      />
                      {user?.pfp_url && (
                        <img
                          src={user.pfp_url}
                          alt={user.username}
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="hasProjectIdea"
                        checked={hasProjectIdea}
                        onChange={(e) => setHasProjectIdea(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="hasProjectIdea"
                        className="text-sm font-medium text-gray-700"
                      >
                        Do you have an idea to build already?
                      </label>
                    </div>

                    {hasProjectIdea && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="projectName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="projectName"
                              id="projectName"
                              placeholder="Your idea name..."
                              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="projectDescription"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <textarea
                              name="projectDescription"
                              id="projectDescription"
                              rows={3}
                              placeholder="Describe your idea..."
                              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </>
                    )}
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
                                        username: user.username,
                                        pfp_url: user.pfp_url,
                                      },
                                    ]);
                                    setSearchQuery("");
                                  }
                                }}
                              >
                                {user.pfp_url && (
                                  <img
                                    src={user.pfp_url}
                                    alt={user.username}
                                    className="h-6 w-6 rounded-full"
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTeamMembers.map((member) => (
                        <div
                          key={member.username}
                          className="bg-purple-100 px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          {member.pfp_url && (
                            <img
                              src={member.pfp_url}
                              alt={member.username}
                              className="h-6 w-6 rounded-full"
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
                        <div className="text-sm text-gray-500">
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
                      name="whyAttend"
                      id="whyAttend"
                      required
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
                      name="previousWork"
                      id="previousWork"
                      rows={3}
                      placeholder="Share links to your Frames, projects, or describe your previous work..."
                      className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
