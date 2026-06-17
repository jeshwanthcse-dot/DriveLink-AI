/**
 * Marketing layout — wraps /features, /how-it-works, /drivers,
 * /organizations, /contact, /faq with the shared Navbar + Footer
 */

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
