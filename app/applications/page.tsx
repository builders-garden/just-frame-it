"use client";

import { TeamMember } from "@/components/TeamMember";
import { useApplications } from "@/hooks/use-applications";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [page, setPage] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useApplications({
    username: debouncedUsername,
    page,
    limit,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setPage(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Enter Password
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Enter password..."
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Applications</h1>
        {data && (
          <div className="text-sm text-gray-600">
            {data.total === data.totalCount ? (
              <span>{data.totalCount} total applications</span>
            ) : (
              <span>
                {data.total} filtered / {data.totalCount} total applications
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by username..."
          value={username}
          onChange={handleUsernameChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {isLoading || username !== debouncedUsername ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 md:p-6 bg-white shadow-sm"
            >
              <div className="flex justify-center items-center h-64">
                <CircularProgress />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border rounded-lg bg-red-50 text-red-700">
          {error instanceof Error
            ? error.message
            : "An error occurred while loading applications"}
        </div>
      ) : data?.applications.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
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
            {username
              ? "Try adjusting your search criteria"
              : "No applications have been submitted yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {data?.applications.map((app) => (
              <div
                key={app.id}
                className="border rounded-lg p-4 md:p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold break-words">
                      {app.projectName}
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {app.projectDescription}
                    </p>
                    {app.previousWork && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                          Previous Work
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {app.previousWork}
                        </p>
                      </div>
                    )}
                  </div>
                  {app.githubUrl && (
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 shrink-0"
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

                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Team Members:
                  </h3>
                  <div className="space-y-3">
                    <TeamMember
                      username={app.teamMember1Username}
                      displayName={app.teamMember1DisplayName}
                      avatarUrl={app.teamMember1AvatarUrl ?? undefined}
                    />
                    {app.teamMember2Username && (
                      <TeamMember
                        username={app.teamMember2Username}
                        displayName={app.teamMember2DisplayName ?? ""}
                        avatarUrl={app.teamMember2AvatarUrl ?? undefined}
                      />
                    )}
                    {app.teamMember3Username && (
                      <TeamMember
                        username={app.teamMember3Username}
                        displayName={app.teamMember3DisplayName ?? ""}
                        avatarUrl={app.teamMember3AvatarUrl ?? undefined}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-6 space-y-3 md:space-y-4 border-t pt-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                      Why do you want to attend?
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {app.whyAttend}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">
                      Can attend in Rome?
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        app.canAttendRome
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.canAttendRome ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data && data.pages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm md:text-base">
                Page {page} of {data.pages} ({data.total} filtered
                {data.total !== data.totalCount &&
                  ` out of ${data.totalCount} total`}
                )
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
