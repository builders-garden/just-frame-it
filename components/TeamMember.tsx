import Image from "next/image";

interface TeamMemberProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export function TeamMember({
  username,
  displayName,
  avatarUrl,
}: TeamMemberProps) {
  return (
    <div
      className="flex flex-col items-start gap-1 cursor-pointer hover:bg-purple-100 hover:rounded-lg p-2 transition-colors duration-200"
      onClick={() => {
        window.open(`https://warpcast.com/${username}`, "_blank");
      }}
    >
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="w-8 h-8 rounded-full border border-gray-300"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-0">
        <a
          href={`https://warpcast.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-blue-600 font-medium text-sm"
        >
          {displayName}
        </a>
        <div className="text-gray-500 text-xs">@{username}</div>
      </div>
    </div>
  );
}
