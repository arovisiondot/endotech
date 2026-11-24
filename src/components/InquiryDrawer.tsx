"use client";

import React from "react";
import Link from "next/link";
import { useInquiry } from "@/context/InquiryContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function InquiryDrawer() {
  const { items, removeItem, updateQuantity, isDrawerOpen, setIsDrawerOpen, totalItems } =
    useInquiry();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Inquiry Basket</h2>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected for quotation
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700">Your Inquiry Basket is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse products and click &ldquo;+ Add to inquiry&rdquo; to request a custom quotation.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.article_code}-${item.selected_size || index}`} className="py-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600 shrink-0">
                    {item.article_code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Art: <span className="font-mono text-slate-700">{item.article_code}</span>
                      {item.selected_size && (
                        <span className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          Size: {item.selected_size}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.article_code,
                              item.quantity - 1,
                              item.selected_size
                            )
                          }
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          title="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.article_code,
                              item.quantity + 1,
                              item.selected_size
                            )
                          }
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          title="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.article_code, item.selected_size)}
                        className="text-slate-400 hover:text-red-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Total Items</span>
                <span className="font-bold text-slate-900">{totalItems} units</span>
              </div>
              <p className="text-xs text-slate-500">
                Submit your inquiry to receive official pricing, MOQ, and technical specification sheet.
              </p>
              <Link
                href="/inquiry"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition"
              >
                Proceed to Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
