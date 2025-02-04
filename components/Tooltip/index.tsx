import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  open?: boolean;
}

export function Tooltip({ children, content, open = false }: TooltipProps) {
  return (
    <div className="relative inline-block">
      {children}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
          {content}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
        </div>
      )}
    </div>
  );
} 