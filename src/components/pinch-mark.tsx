import { cn } from "@/lib/utils";

export function PinchMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("rounded-md bg-secondary text-primary", className)}
      fill="none"
      aria-hidden
    >
      <rect x="11" y="7" width="10" height="18" rx="2.5" fill="currentColor" />
      <path
        d="M6.25 10.5v11M25.75 10.5v11"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
