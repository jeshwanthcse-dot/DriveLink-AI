import { Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-soft">
        <Truck className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          DriveLink <span className="text-primary">AI</span>
        </span>
      )}
    </Link>
  );
}
