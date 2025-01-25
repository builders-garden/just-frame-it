import { SafeAreaInsets } from "@/types";

interface SafeAreaContainerProps {
  children: React.ReactNode;
  insets?: SafeAreaInsets;
}

export default function SafeAreaContainer({
  children,
  insets,
}: SafeAreaContainerProps) {
  return (
    <main
      className="bg-white flex min-h-screen max-w-screen flex-col items-center justify-center gap-y-3"
      style={{
        marginTop: insets?.top ?? 0,
        marginBottom: insets?.bottom ?? 0,
        marginLeft: insets?.left ?? 0,
        marginRight: insets?.right ?? 0,
      }}
    >
      {children}
    </main>
  );
}
