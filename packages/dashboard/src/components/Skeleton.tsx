import clsx from "clsx";

interface SkeletonProps {
  items?: number;
  withCircles?: boolean;
  className?: string;
}

export const Skeleton = ({
  items,
  withCircles = true,
  className,
}: SkeletonProps) => (
  <div className={clsx("animate-pulse space-y-5", className)}>
    {new Array(items ?? 6).fill(undefined).map((_, index) => (
      <div key={index} className="flex space-x-4" aria-hidden>
        {withCircles && (
          <div className="h-5 w-5 rounded-full bg-neutral-300"></div>
        )}
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-neutral-300"></div>
        </div>
      </div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);
