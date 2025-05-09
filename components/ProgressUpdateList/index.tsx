"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { useApiQuery } from "@/hooks/use-api-query";
import { useMe } from "@/hooks/use-users";
import { ALLOWED_PROGRESS_UPDATE_FIDS } from "@/lib/constants";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal";
import { ProgressUpdateForm } from "../ProgressUpdateForm";

interface ProgressUpdate {
  id: string;
  createdAt: string;
  teamName: string;
  demoLink: string | null;
  keyFeatures: string;
  userEngagement: string;
  challenges: string;
  nextSteps: string;
  additionalNotes: string | null;
  authorFid: number;
  authorDisplayName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
}

// Helper function to convert URLs in text to clickable links
const convertUrlsToLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Helper function to get update number for a team
const getUpdateNumberForTeam = (
  updates: ProgressUpdate[],
  teamName: string,
  currentId: string
): number => {
  const teamUpdates = updates
    .filter((u) => u.teamName === teamName)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  return teamUpdates.findIndex((u) => u.id === currentId) + 1;
};

export function ProgressUpdateList() {
  const { data: user } = useMe();
  const [editingUpdate, setEditingUpdate] = useState<ProgressUpdate | null>(
    null
  );
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<ProgressUpdate | null>(null);
  const {
    data: updates = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery<ProgressUpdate[]>({
    url: `/api/progress-updates?teamName=${
      ALLOWED_PROGRESS_UPDATE_FIDS[user?.fid!]
    }`,
    method: "GET",
    queryKey: ["progress-updates"],
    isProtected: true,
    enabled: !!user,
  });

  const { mutate: deleteProgressUpdate, isPending: isDeleting } =
    useApiMutation<ProgressUpdate, { id: string }>({
      url: (variables) => `/api/progress-updates/${variables.id}`,
      method: "DELETE",
      isProtected: true,
      onSuccess: () => {
        refetch();
      },
    });

  const { mutate: updateProgressUpdate, isPending: isUpdating } =
    useApiMutation<
      ProgressUpdate,
      Omit<
        ProgressUpdate,
        | "id"
        | "createdAt"
        | "authorFid"
        | "authorDisplayName"
        | "authorUsername"
        | "authorAvatarUrl"
      >
    >({
      url: `/api/progress-updates/${editingUpdate?.id}`,
      method: "POST",
      body: (variables) => variables,
      onSuccess: () => {
        setEditingUpdate(null);
        refetch();
      },
    });

  if (!user) {
    return <></>;
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No progress updates yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col space-y-4">
            {/* Header section with team info and update number */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-semibold">{update.teamName}</h3>
                  <p className="text-sm text-gray-500">
                    Update #
                    {getUpdateNumberForTeam(
                      updates,
                      update.teamName,
                      update.id
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {update.authorAvatarUrl ? (
                    <Image
                      src={update.authorAvatarUrl}
                      alt={update.authorDisplayName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  )}
                  <div>
                    <p className="font-medium">{update.authorDisplayName}</p>
                    <p className="text-sm text-gray-500">
                      @{update.authorUsername}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta information */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {format(new Date(update.createdAt), "MMM d, yyyy")}
              </span>
              {user?.fid.toString() === update.authorFid.toString() && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingUpdate(update)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(update)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Demo link */}
            {update.demoLink && (
              <div className="mt-2">
                <a
                  href={update.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Demo
                </a>
              </div>
            )}

            {/* Content sections */}
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="font-bold mb-2">Key Features Built</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {convertUrlsToLinks(update.keyFeatures)}
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">User & Market Engagement</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {convertUrlsToLinks(update.userEngagement)}
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Challenges & Blockers</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {convertUrlsToLinks(update.challenges)}
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Next Steps</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {convertUrlsToLinks(update.nextSteps)}
                </p>
              </div>

              {update.additionalNotes && (
                <div>
                  <h4 className="font-bold mb-2">Additional Notes</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {convertUrlsToLinks(update.additionalNotes)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {editingUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Progress Update</h2>
              <button
                onClick={() => setEditingUpdate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProgressUpdateForm
              initialData={{
                teamName: editingUpdate.teamName,
                demoLink: editingUpdate.demoLink || "",
                keyFeatures: editingUpdate.keyFeatures,
                userEngagement: editingUpdate.userEngagement,
                challenges: editingUpdate.challenges,
                nextSteps: editingUpdate.nextSteps,
                additionalNotes: editingUpdate.additionalNotes || "",
              }}
              onSubmit={(data) => updateProgressUpdate(data)}
              isSubmitting={isUpdating}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={() => {
          if (deleteConfirmation) {
            deleteProgressUpdate({ id: deleteConfirmation.id });
          }
        }}
        title="Delete Progress Update"
        message="Are you sure you want to delete this progress update? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
