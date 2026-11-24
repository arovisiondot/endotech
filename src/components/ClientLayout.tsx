"use client";

import React, { Suspense } from "react";
import { InquiryProvider } from "@/context/InquiryContext";
import { ContentProvider } from "@/context/ContentContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InquiryDrawer from "@/components/InquiryDrawer";
import CustomCursor from "@/components/CustomCursor";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <InquiryProvider>
        <CustomCursor />
        <Suspense fallback={<header className="w-full h-20 bg-white border-b border-slate-200" />}>
          <Header />
        </Suspense>
        <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
        <Footer />
        <InquiryDrawer />
      </InquiryProvider>
    </ContentProvider>
  );
}
