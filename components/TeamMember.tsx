interface TeamMemberProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export function TeamMember({ username, displayName, avatarUrl }: TeamMemberProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="w-10 h-10 rounded-full"
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