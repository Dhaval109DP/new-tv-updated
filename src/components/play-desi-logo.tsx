import { cn } from "@/lib/utils";

export function PlayDesiLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0 font-headline font-bold text-2xl", className)}>
      <span className="text-muted-foreground">Play</span>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-[-2px] -mb-1"
      >
        <path
          d="M16 2L29.8564 9V23L16 30L2.1436 23V9L16 2Z"
          className="fill-primary"
        />
        <path d="M13 12L21 16L13 20V12Z" className="fill-primary-foreground" />
      </svg>
      <span className="text-primary">esi!</span>
    </div>
  );
}
