"use client";

import { useMe } from "@/hooks/use-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { useEffect, useState } from "react";

interface ProgressUpdateData {
  id?: string;
  teamName: string;
  demoLink: string;
  keyFeatures: string;
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
  isSubmitting,
}: ProgressUpdateFormProps) {
  const [error, setError] = useState<Error | null>(null);
  const { data: user } = useMe();
  const [formData, setFormData] = useState<ProgressUpdateData>({
    teamName: user?.fid
      ? (ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid.toString()] as string)
      : "",
    demoLink: "",
    keyFeatures: "",
    userEngagement: "",
    challenges: "",
    nextSteps: "",
    additionalNotes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (user?.fid) {
      setFormData((prev) => ({
        ...prev,
        teamName: ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid!.toString() as string],
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit?.(formData);
    } catch (error) {
      console.error(error);
      setError(error as Error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg p-6">
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
                  Detail the most important features you&apos;ve developed in
                  the past two weeks from both a product and technical
                  perspective. Highlight what&apos;s been shipped, improved, or
                  iterated on. Include links to demos, repos, or designs if
                  relevant.
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
                htmlFor="userEngagement"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                2. User & Market Engagement
                <p className="text-xs text-gray-500">
                  Share insights and metrics related to user engagement,
                  retention, and market feedback. Include onboarding
                  initiatives, retention strategies, user interviews, or
                  surveys. Be specific with numbers if possible — signups, daily
                  active users, conversions, etc.
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
                3. Challenges & Blockers
                <p className="text-xs text-gray-500">
                  Highlight any challenges that impacted progress. This can
                  include technical obstacles, design bottlenecks, internal
                  communication issues, or anything else slowing you down.
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
                4. Next Steps (Next 2 Weeks)
                <p className="text-xs text-gray-500">
                  Explain what you plan to focus on in the upcoming sprint.
                  Describe what you aim to build, improve, or validate. Include
                  what progress you expect to see.
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
              Share anything else worth noting. This can include technical
              updates, team or organizational changes, external opportunities,
              or reflections from the last sprint.
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
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
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
