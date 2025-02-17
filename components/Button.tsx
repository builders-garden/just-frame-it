export default function Button({
  children,
  onClick,
  disabled,
  isLoading,
  variant = "filled",
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "filled" | "bordered";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden
        ${
          variant === "filled"
            ? "px-6 py-3 md:px-8 md:py-4"
            : "px-6 py-5 md:px-8 md:py-5"
        }
        text-xl md:text-2xl font-semibold shadow-md
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
        transition-colors duration-200
        ${
          variant === "filled"
            ? disabled
              ? "bg-purple-600/50 text-white cursor-not-allowed opacity-50"
              : "bg-purple-600 hover:bg-purple-700 text-white"
            : disabled
            ? "border-2 border-purple-600/50 text-purple-600/50 cursor-not-allowed opacity-50"
            : "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
        }
        ${isLoading && "animate-pulse"}
        before:absolute before:content-[''] before:top-0 before:left-[-100%] before:w-[120%] before:h-full
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:animate-shine before:skew-x-[-25deg]
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-5 h-5 border-t-2 rounded-full animate-spin ${
              variant === "filled" ? "border-white" : "border-purple-600"
            }`}
          />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
