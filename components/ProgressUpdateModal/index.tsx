import { useApiMutation } from "@/hooks/use-api-mutation";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressUpdateForm } from "../ProgressUpdateForm";

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProgressUpdateModal({
  isOpen,
  onClose,
  onSuccess,
}: ProgressUpdateModalProps) {
  const { mutate: submitProgressUpdate, isPending: isSubmitting } =
    useApiMutation({
      url: "/api/progress-updates",
      method: "POST",
      body: (variables) => variables,
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
      isProtected: true,
    });

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
                  <h2 className="text-2xl font-bold">Submit Progress Update</h2>
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

                <ProgressUpdateForm
                  onSubmit={submitProgressUpdate}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
