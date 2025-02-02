import { QRCode } from "@farcaster/auth-kit";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  onRetry: () => void;
  channelToken: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  url,
  onRetry,
  channelToken,
}: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-[360px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col gap-6 items-center justify-center">
          <h2 className="text-2xl font-bold text-center">
            Sign in with Farcaster <br></br>to apply
          </h2>
          <p className="text-gray-600 text-center">
            To sign in with Farcaster, scan the code below with your
            phone&apos;s camera.
          </p>
          <QRCode uri={url} size={200} />

          <a
            href={`https://warpcast.com/~/siwf?channelToken=${channelToken}`}
            target="_blank"
            className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
          >
            I&apos;m using my phone
          </a>
        </div>
      </div>
    </div>
  );
}
