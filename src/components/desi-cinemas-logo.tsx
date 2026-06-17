import { cn } from "@/lib/utils";

export function DesiCinemasLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-headline font-bold", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="text-primary">
            <path
            d="M7 21l1.43-11.42A2 2 0 0110.42 8h3.16a2 2 0 011.99 1.58L17 21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            />
            <path
            d="M10 8V21M14 8V21M7 14.5h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            />
        </g>
        <path
            d="M7.5 8a2 2 0 012-2h5a2 2 0 012 2c0 .76-.42 1.43-1.06 1.77-.94.5-2.04.2-2.8-.53-.76-.73-1.85-.94-2.88-.56A2.02 2.02 0 007.5 8z"
            className="fill-accent"
        />
        <g className="text-foreground/80">
            <path d="M5.5 6V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5.5 8H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5.5 12H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5.5 16H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </svg>
      <span className="text-2xl">
        <span className="text-foreground">Desi</span>
        <span className="text-primary">Cinemas</span>
      </span>
    </div>
  );
}
