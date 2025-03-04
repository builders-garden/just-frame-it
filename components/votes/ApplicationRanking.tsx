import { Application, Vote } from "@prisma/client";

type ApplicationWithScores = Application & {
  votes: Vote[];
  totalScore: number;
  voteCount: number;
};

interface ApplicationRankingProps {
  applications: ApplicationWithScores[];
}

export function ApplicationRanking({ applications }: ApplicationRankingProps) {
  return (
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Votes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app, index) => (
            <tr
              key={app.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {app.projectName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {app.totalScore}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {app.voteCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
