/**
 * OrganizationFooter — Simple professional footer for the organization portal layout.
 */

import Link from "next/link";

export function OrganizationFooter() {
  return (
    <footer className="border-t border-border bg-card/40 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          <span>© {new Date().getFullYear()} DriveLink AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#support" className="hover:text-foreground transition-colors">
            Support Helpdesk
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span className="text-muted-foreground/30" aria-hidden>
            |
          </span>
          <span className="font-mono bg-muted px-2 py-0.5 rounded text-[10px]" title="Current application build version">
            v1.2.0-beta
          </span>
        </div>
      </div>
    </footer>
  );
}
