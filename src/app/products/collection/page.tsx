import React, { Suspense } from "react";
import SubcategoryCollectionClient from "@/components/SubcategoryCollectionClient";

export const dynamic = "force-dynamic";

function CollectionContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  return (
    <AsyncCollectionWrapper searchParams={searchParams} />
  );
}

async function AsyncCollectionWrapper({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const params = await searchParams;
  const categorySlug = params.category || "general-instrumentation";
  const subcategoryName = params.subcategory || "Scalpels";

  // Pretty category name formatter
  const formattedCategoryName = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <SubcategoryCollectionClient
      categorySlug={categorySlug}
      categoryName={formattedCategoryName}
      subcategoryName={subcategoryName}
    />
  );
}

export default function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-500 font-bold">
          Loading product collection...
        </div>
      }
    >
      <CollectionContent searchParams={searchParams} />
    </Suspense>
  );
}

