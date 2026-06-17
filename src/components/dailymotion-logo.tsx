import { cn } from "@/lib/utils";

export function DailymotionLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-headline font-bold", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M229.53,153.29,184.8,111.63a4,4,0,0,0-5.46.26L129,165.23a4,4,0,0,1-5.49.16l-46.1-41.22a4,4,0,0,0-5.3,0L26.47,153.29a4,4,0,0,0,2.65,6.91H73.34a4,4,0,0,1,3.43,2L98.5,188.45a4,4,0,0,0,3.37,2h52.25a4,4,0,0,0,3.37-2l21.74-26.24a4,4,0,0,1,3.43-2h44.22A4,4,0,0,0,229.53,153.29ZM128,68a60,60,0,1,0,60,60A60.07,60.07,0,0,0,128,68Zm0,112a52,52,0,1,1,52-52A52.06,52.06,0,0,1,128,180Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-2xl">
        <span className="text-foreground">Dailymotion</span>
      </span>
    </div>
  );
}
