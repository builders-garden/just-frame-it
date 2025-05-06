"use client";
import FarcasterSignInButton from "@/components/FarcasterSignInButton";
import { FeedbackList } from "@/components/FeedbackList";
import { ProgressUpdateList } from "@/components/ProgressUpdateList";
import { ProgressUpdateModal } from "@/components/ProgressUpdateModal";
import { useSignIn } from "@/hooks/use-sign-in";
import { useProfile } from "@farcaster/auth-kit";
import { useState } from "react";

export default function ProgressUpdatesPage() {
  const { isAuthenticated, profile } = useProfile();
  const { signIn } = useSignIn({
    onSuccess: () => {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"updates" | "feedback">("updates");

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Progress Updates</h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your team&apos;s progress and milestones
          </p>
        </div>
        {isAuthenticated || localStorage.getItem("token") ? (
          <div className="flex flex-col gap-4">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("updates")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "updates"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Progress Updates
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "feedback"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Feedbacks
              </button>
            </div>

            {activeTab === "updates" ? (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit New Progress
                  </button>
                </div>
                <div className="w-full">
                  <ProgressUpdateList key={refreshKey} />
                </div>
                <ProgressUpdateModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSuccess={handleSuccess}
                />
              </>
            ) : (
              <div className="w-full">
                <FeedbackList />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <FarcasterSignInButton
              onSuccess={({ message, signature, fid }) => {
                signIn({ message, signature, fid });
              }}
              onError={(error) => {
                console.error("sign in error", error);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
