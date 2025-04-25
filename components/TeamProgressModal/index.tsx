import { useApiQuery } from "@/hooks/use-api-query";
import { DEMO_DAY_DATES, DemoDay } from "@/lib/constants";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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

interface TeamProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

const makeLinksClickable = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text?.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
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

const getDemoDayForDate = (date: string): DemoDay | null => {
  const updateDate = new Date(date);
  console.log("updateDate", updateDate);

  const demoDayEntries = Object.entries(DEMO_DAY_DATES);

  for (let i = 0; i < demoDayEntries.length; i++) {
    const [demoDay, { date: currentDemoDate }] = demoDayEntries[i];
    const prevDemoDate = i > 0 ? demoDayEntries[i - 1][1].date : new Date(0);
    console.log("currentDemoDate", currentDemoDate);
    console.log("prevDemoDate", prevDemoDate);
    console.log("updateDate", updateDate);
    const updateDateOnly = new Date(updateDate.toDateString());
    const currentDemoDateOnly = new Date(currentDemoDate.toDateString());
    const prevDemoDateOnly = new Date(prevDemoDate.toDateString());
    if (
      updateDateOnly <= currentDemoDateOnly &&
      updateDateOnly >= prevDemoDateOnly
    ) {
      return demoDay as DemoDay;
    }
  }

  return null;
};

export function TeamProgressModal({
  isOpen,
  onClose,
  teamName,
}: TeamProgressModalProps) {
  const { data: updates = [], isLoading } = useApiQuery<ProgressUpdate[]>({
    url: `/api/progress-updates?teamName=${encodeURIComponent(teamName)}`,
    method: "GET",
    queryKey: ["team-progress", teamName],
    isProtected: true,
  });

  // Group updates by demo day
  const updatesByDemoDay = updates.reduce((acc, update) => {
    const demoDay = getDemoDayForDate(update.createdAt);
    if (demoDay) {
      if (!acc[demoDay]) {
        acc[demoDay] = [];
      }
      acc[demoDay].push(update);
    }
    return acc;
  }, {} as Record<DemoDay, ProgressUpdate[]>);

  console.log("Updates by demo day:", updatesByDemoDay);

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
                  <h2 className="text-2xl font-bold">
                    {teamName} Progress Updates
                  </h2>
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

                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-gray-500">No progress updates yet.</p>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(updatesByDemoDay).map(
                      ([demoDay, demoDayUpdates]) => (
                        <div key={demoDay} className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <h3 className="text-lg font-semibold text-gray-700">
                              DEMO DAY {demoDay.split("_")[1]}
                            </h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                          </div>
                          {demoDayUpdates.map((update) => (
                            <div
                              key={update.id}
                              className="bg-gray-50 rounded-lg p-6"
                            >
                              <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {format(
                                        new Date(update.createdAt),
                                        "MMMM d, yyyy"
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
                                      <p className="font-medium">
                                        {update.authorDisplayName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        @{update.authorUsername}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6 mt-4">
                                <div>
                                  <h4 className="font-bold mb-2">
                                    Key Features Built
                                  </h4>
                                  <p className="text-gray-700 whitespace-pre-wrap">
                                    {makeLinksClickable(update.keyFeatures)}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-bold mb-2">
                                    User & Market Engagement
                                  </h4>
                                  <p className="text-gray-700 whitespace-pre-wrap">
                                    {makeLinksClickable(update.userEngagement)}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-bold mb-2">
                                    Challenges & Blockers
                                  </h4>
                                  <p className="text-gray-700 whitespace-pre-wrap">
                                    {makeLinksClickable(update.challenges)}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-bold mb-2">Next Steps</h4>
                                  <p className="text-gray-700 whitespace-pre-wrap">
                                    {makeLinksClickable(update.nextSteps)}
                                  </p>
                                </div>

                                {update.additionalNotes && (
                                  <div>
                                    <h4 className="font-bold mb-2">
                                      Additional Notes
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                      {makeLinksClickable(
                                        update.additionalNotes
                                      )}
                                    </p>
                                  </div>
                                )}

                                {update.demoLink && (
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Demo Link
                                    </h4>
                                    <a
                                      href={update.demoLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      {update.demoLink}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
