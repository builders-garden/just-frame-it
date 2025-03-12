import Image from "next/image";

interface TeamMemberProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  mode?: "horizontal" | "vertical";
}

export function TeamMember({
  username,
  displayName,
  avatarUrl,
  mode = "horizontal",
}: TeamMemberProps) {
  const isHorizontalMode = mode === "horizontal";
  const containerClasses = isHorizontalMode
    ? "flex items-center space-x-3"
    : "flex flex-col items-start gap-1 cursor-pointer hover:bg-purple-100 hover:rounded-lg p-2 transition-colors duration-200";

  const avatarSize = isHorizontalMode ? "w-10 h-10" : "w-8 h-8";
  const avatarClasses = `${avatarSize} rounded-full ${
    !isHorizontalMode ? "border border-gray-300" : ""
  }`;

  const contentClasses = isHorizontalMode ? "" : "flex flex-col items-start gap-0";

  const nameClasses = isHorizontalMode
    ? "text-gray-900 hover:text-blue-600 font-medium"
    : "text-gray-900 hover:text-blue-600 font-medium text-sm";

  const usernameClasses = isHorizontalMode
    ? "text-gray-500 text-sm"
    : "text-gray-500 text-xs";

  return (
    <div
      className={`${containerClasses} cursor-pointer hover:bg-purple-100 hover:rounded-lg p-2 transition-colors duration-200`}
      onClick={() =>
        !isHorizontalMode &&
        window.open(`https://warpcast.com/${username}`, "_blank")
      }
    >
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className={avatarClasses}
            width={40}
            height={40}
          />
        ) : (
          <div
            className={`${avatarClasses} bg-gray-200 flex items-center justify-center`}
          >
            <span className="text-gray-500 text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className={contentClasses}>
        <a
          href={`https://warpcast.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={nameClasses}
        >
          {displayName}
        </a>
        <div className={usernameClasses}>@{username}</div>
      </div>
    </div>
  );
}
