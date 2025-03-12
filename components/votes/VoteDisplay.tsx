import { Application, Vote } from "@prisma/client";

interface VoteDisplayProps {
  applications: (Application & {
    votes: Vote[];
  })[];
  voterFid: number;
}

export function VoteDisplay({ applications, voterFid }: VoteDisplayProps) {
  return (
    <div className="space-y-6">
      {applications.map((app) => {
        const userVote = app.votes.find((vote) => vote.voterFid === voterFid);

        return (
          <div key={app.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {app.projectName}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.projectDescription}
                </p>
              </div>
              {userVote ? (
                <div className="flex gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Experience</span>
                    <div className="text-lg font-semibold">
                      {userVote.experience}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Idea</span>
                    <div className="text-lg font-semibold">
                      {userVote.idea}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Virality</span>
                    <div className="text-lg font-semibold">
                      {userVote.virality}/10
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Not voted yet</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
