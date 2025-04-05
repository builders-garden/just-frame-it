"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { useMe } from "@/hooks/use-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

interface ProgressUpdateFormProps {
  initialData?: ProgressUpdateData;
  onSubmit?: (data: ProgressUpdateData) => void;
  isSubmitting?: boolean;
}

export function ProgressUpdateForm({
  initialData,
  onSubmit,
  isSubmitting: externalIsSubmitting,
}: ProgressUpdateFormProps) {
  const router = useRouter();
  const { data: user } = useMe();
  const [formData, setFormData] = useState<ProgressUpdateData>({
    teamName: user?.fid
      ? (ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid.toString()] as string)
      : "",
    demoLink: "",
    keyFeatures: "",
    technicalMilestones: "",
    userEngagement: "",
    challenges: "",
    nextSteps: "",
    additionalNotes: "",
  });

  const {
    mutate: submitProgressUpdate,
    isPending: isSubmitting,
    error,
  } = useApiMutation<unknown, ProgressUpdateData>({
    url: "/api/progress-updates",
    method: "POST",
    onSuccess: () => {
      // Reset form and refresh the page
      setFormData({
        teamName: user?.fid
          ? (ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid.toString()] as string)
          : "",
        demoLink: "",
        keyFeatures: "",
        technicalMilestones: "",
        userEngagement: "",
        challenges: "",
        nextSteps: "",
        additionalNotes: "",
      });
      router.refresh();
    },
    isProtected: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    console.log("user", user);
    if (user?.fid) {
      console.log(
        "user fid",
        ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid!.toString() as string]
      );
      setFormData((prev) => ({
        ...prev,
        teamName: ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid!.toString() as string],
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      submitProgressUpdate(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Progress Update" : "Submit Progress Update"}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error.message}
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
            Demo Link (if available - can be a cast, a video or a link to a
            website)
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
                <p className="text-xs text-gray-500">
                  List the key features you&apos;ve built. Feel free to add
                  links when relevant.
                </p>
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
                <p className="text-xs text-gray-500">
                  List the technical milestones you&apos;ve achieved. Feel free
                  to add links when relevant.
                </p>
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
                <p className="text-xs text-gray-500">
                  Anything related to user engagement, market engagement,
                  retention, etc. It can be things you&apos;ve done to onboard
                  users, things you&apos;ve done to retain users, as well as
                  actual engagement metrics.
                </p>
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
                <p className="text-xs text-gray-500">
                  List the challenges and blockers you&apos;ve faced or are
                  facing.
                </p>
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
                <p className="text-xs text-gray-500">
                  List the next steps you&apos;re going to take.
                </p>
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
            <p className="text-xs text-gray-500">
              Anything else you&apos;d like to add, as well as goals for the
              next period.
            </p>
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
            type="submit"
            disabled={isSubmitting || externalIsSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting || externalIsSubmitting
              ? "Submitting..."
              : initialData
              ? "Update"
              : "Submit Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
