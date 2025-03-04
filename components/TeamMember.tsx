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
      className="flex items-center space-x-3 cursor-pointer hover:bg-purple-100 hover:rounded-lg p-2 transition-colors duration-200"
      onClick={() => {
        window.open(`https://warpcast.com/${username}`, "_blank");
      }}
    >
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div>
        <a
          href={`https://warpcast.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-blue-600 font-medium"
        >
          {displayName}
        </a>
        <div className="text-gray-500 text-sm">@{username}</div>
      </div>
    </div>
  );
}
