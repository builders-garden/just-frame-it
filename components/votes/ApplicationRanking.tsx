import { Application, Vote } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { ApplicationDetailsModal } from "./ApplicationDetailsModal";

type SortField = "totalScore" | "avgScore";
type SortDirection = "asc" | "desc";

type ApplicationWithScores = Application & {
  votes: Vote[];
  totalScore: number;
  voteCount: number;
};

interface ApplicationRankingProps {
  applications: ApplicationWithScores[];
  farcasterUsers: { fid: string; pfp_url: string }[];
}

export function ApplicationRanking({
  applications,
  farcasterUsers,
}: ApplicationRankingProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationWithScores | null>(null);
  const [sortField, setSortField] = useState<SortField>("totalScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    const aValue =
      sortField === "avgScore"
        ? a.voteCount > 0
          ? a.totalScore / a.voteCount
          : 0
        : a.totalScore;
    const bValue =
      sortField === "avgScore"
        ? b.voteCount > 0
          ? b.totalScore / b.voteCount
          : 0
        : b.totalScore;

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalScore")}
              >
                Total Score {getSortIcon("totalScore")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("avgScore")}
              >
                Avg Score {getSortIcon("avgScore")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voter FIDs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IRL Residency Rome
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedApplications.map((app, index) => (
              <tr
                key={app.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {app.projectName}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.totalScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.voteCount > 0
                    ? (app.totalScore / app.voteCount).toFixed(2)
                    : "0.00"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.voteCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {app.votes.map((vote) => {
                      const user = farcasterUsers.find(
                        (u) => u.fid.toString() === vote.voterFid.toString()
                      );
                      return (
                        <span
                          key={vote.id}
                          className="inline-flex items-center"
                          title={`FID: ${vote.voterFid}`}
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {vote.voterFid}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.canAttendRome
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.canAttendRome ? "Can Attend" : "Cannot Attend"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          application={selectedApplication}
          farcasterUsers={farcasterUsers}
        />
      )}
    </>
  );
}
