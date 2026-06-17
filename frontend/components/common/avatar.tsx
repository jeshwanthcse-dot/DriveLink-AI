/**
 * Avatar — Initials-based avatar with optional image and size variants
 * Server component — purely presentational
 */

import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  initials: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ initials, src, alt, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary ring-2 ring-background",
        sizeClasses[size],
        className
      )}
      aria-label={alt ?? `Avatar for ${initials}`}
      role="img"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? initials}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
