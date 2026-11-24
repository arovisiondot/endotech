"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/database";
import { useInquiry } from "@/context/InquiryContext";
import { Plus, Check, ArrowRight, Eye } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useInquiry();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      article_code: product.article_code,
      selected_size: product.cup_size || product.length || "Standard",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Product Image Area */}
      <div className="relative aspect-square bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-center overflow-hidden">
        {/* Placeholder or real image */}
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Subtle medical instrument stylized representation */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
              <div className="w-2.5 h-28 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-full shadow-inner transform -rotate-45 group-hover:scale-105 transition duration-300" />
              <div className="absolute w-8 h-8 rounded-full border-2 border-slate-400 transform -rotate-45" />
            </div>
          </div>
        </div>

        {/* Quick View link overlay */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition"
          title="View specifications"
        >
          <Eye className="w-4 h-4" />
        </Link>

        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {product.product_type || "Surgical Instrument"}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="text-xs text-slate-500 mt-1">
            Code: <span className="font-mono font-medium text-slate-700">{product.article_code}</span>
          </div>
          {product.length && (
            <div className="text-[11px] text-slate-400 mt-0.5">Length: {product.length}</div>
          )}
        </div>

        {/* Card Actions */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href={`/products/${product.slug}`}
            className="text-slate-600 hover:text-red-600 font-semibold flex items-center gap-1 transition"
          >
            <span>View details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
              added
                ? "bg-green-600 text-white"
                : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to inquiry</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
