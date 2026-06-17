import { cn } from "@/lib/utils";

export function BollyzoneLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-headline font-bold", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
      >
        <path
          d="M4 8.5V17.5C4 18.6046 4.89543 19.5 6 19.5H18C19.1046 19.5 20 18.6046 20 17.5V8.5C20 7.39543 19.1046 6.5 18 6.5H6C4.89543 6.5 4 7.39543 4 8.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 4L11 6.5M15 4L13 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.5 11V15L14 13L10.5 11Z" className="fill-primary" />
      </svg>
      <span className="text-2xl">
        <span className="text-primary">Bolly</span>
        <span className="text-foreground">zone</span>
      </span>
    </div>
  );
}
