import type { Metadata } from "next";
import "./globals.css";
import "./tailwind-built.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "ENDO TECH GROUP OF INDUSTRIES | Precision Surgical Instruments",
  description:
    "35+ Years of Excellence in precision-engineered surgical instruments, Kerrison rongeurs, scalpel handles, ENT and dental tools from Sialkot, Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth w-full max-w-full overflow-x-clip">
      <body className="min-h-full w-full max-w-full overflow-x-clip flex flex-col font-sans text-slate-800 bg-white selection:bg-red-500 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
