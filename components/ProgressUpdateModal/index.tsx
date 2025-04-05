import { useApiMutation } from "@/hooks/use-api-mutation";
import { useMe } from "@/hooks/use-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ProgressUpdateData {
  teamName: string;
  demoLink: string;
  keyFeatures: string;
  technicalMilestones: string;
  userEngagement: string;
  challenges: string;
  nextSteps: string;
  additionalNotes: string;
}

export function ProgressUpdateModal({
  isOpen,
  onClose,
  onSuccess,
}: ProgressUpdateModalProps) {
  const { data: user } = useMe();
  const [formData, setFormData] = useState<ProgressUpdateData>({
    teamName: user?.fid
      ? (ALLOWED_PROGRESS_UPDATE_FIDS[user.fid.toString()] as string)
      : "",
    demoLink: "",
    keyFeatures: "",
    technicalMilestones: "",
    userEngagement: "",
    challenges: "",
    nextSteps: "",
    additionalNotes: "",
  });

  const [error, setError] = useState<string | null>(null);

  const { mutate: submitProgressUpdate, isPending: isSubmitting } =
    useApiMutation({
      url: "/api/progress-updates",
      method: "POST",
      body: (variables: ProgressUpdateData) => variables,
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error submitting progress update:", error);
        setError(error.message || "An error occurred");
      },
      isProtected: true,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    submitProgressUpdate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("user", user);
    if (user?.fid) {
      setFormData((prev) => ({
        ...prev,
        teamName: ALLOWED_PROGRESS_UPDATE_FIDS[user.fid.toString()],
      }));
    }
  }, [user]);

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
              <div className="max-w-3xl mx-auto p-4 sm:p-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Progress Update</h2>
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

                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="teamName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Team Name
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="demoLink"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Demo Link (if available)
                    </label>
                    <input
                      type="url"
                      id="demoLink"
                      name="demoLink"
                      value={formData.demoLink}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Progress Update (Last 2 Weeks)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="keyFeatures"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          1. Key Features Built
                        </label>
                        <textarea
                          id="keyFeatures"
                          name="keyFeatures"
                          value={formData.keyFeatures}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="technicalMilestones"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          2. Technical Milestones Achieved
                        </label>
                        <textarea
                          id="technicalMilestones"
                          name="technicalMilestones"
                          value={formData.technicalMilestones}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="userEngagement"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          3. User & Market Engagement
                        </label>
                        <textarea
                          id="userEngagement"
                          name="userEngagement"
                          value={formData.userEngagement}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="challenges"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          4. Challenges & Blockers
                        </label>
                        <textarea
                          id="challenges"
                          name="challenges"
                          value={formData.challenges}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="nextSteps"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          5. Next Steps (Next 2 Weeks)
                        </label>
                        <textarea
                          id="nextSteps"
                          name="nextSteps"
                          value={formData.nextSteps}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="additionalNotes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mr-4 px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Update"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
