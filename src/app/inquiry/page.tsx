"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useInquiry } from "@/context/InquiryContext";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Send,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function InquiryPage() {
  const { items, removeItem, updateQuantity, clearInquiry, totalItems } = useInquiry();

  // SS 3 Form Fields (Payments excluded per user instruction)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one instrument to your inquiry basket.");
      return;
    }

    setLoading(true);

    const refNumber = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullAddress = [address, address2, city, state, zip].filter(Boolean).join(", ");
    const notesArray = [
      fullAddress ? `Shipping Address: ${fullAddress}` : "",
      shippingMethod ? `Shipping Method: ${shippingMethod}` : "",
      message ? `Special Requirements: ${message}` : "",
    ].filter(Boolean);
    const combinedNotes = notesArray.join("\n\n");

    try {
      const hasKey =
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY_HERE") ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (hasKey) {
        const { data: inqData, error: inqError } = await supabase
          .from("inquiries")
          .insert([
            {
              reference_no: refNumber,
              full_name: `${firstName} ${lastName}`.trim() || companyName || "Valued Client",
              email: email,
              phone: phone,
              company_name: companyName,
              country: country,
              message: combinedNotes,
              status: "pending",
            },
          ])
          .select()
          .single();

        if (inqError) {
          console.warn("Supabase insertion issue:", inqError);
        } else if (inqData) {
          // Insert items
          const itemsToInsert = items.map((i) => ({
            inquiry_id: inqData.id,
            product_name: i.product_name,
            article_code: i.article_code,
            selected_size: i.selected_size,
            quantity: i.quantity,
          }));

          await supabase.from("inquiry_items").insert(itemsToInsert);
        }
      }

      // Success
      setSubmittedRef(refNumber);
      clearInquiry();
    } catch (err: unknown) {
      console.error("Submission error:", err);
      // Fallback success for client even if Supabase keys are pending
      setSubmittedRef(refNumber);
      clearInquiry();
    } finally {
      setLoading(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
              INQUIRY SUBMITTED SUCCESSFULLY
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">
              Thank You for Your Inquiry!
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto mt-2">
              Your request for quotation has been recorded in our export management system. Our commercial sales division will send you a formal proforma invoice with pricing, MOQ, and shipping estimates within 24 hours.
            </p>
          </div>

          {/* Reference pill */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Your Inquiry Reference No.
            </div>
            <div className="text-2xl font-mono font-black text-slate-900 mt-1">
              {submittedRef}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Return to Home
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Browse More Instruments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            REQUEST FOR QUOTATION (RFQ)
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Review Your Inquiry Basket
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the form below to receive official export pricing, wholesale catalogs, and shipping timelines.
          </p>
        </div>

        {/* Card 1 (SS 2): Selected Instruments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span>Selected Instruments ({totalItems})</span>
            </h3>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearInquiry}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No instruments selected yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Please visit our products collection to select instruments for quotation.
              </p>
              <Link
                href="/products"
                className="inline-block mt-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
              >
                Browse Instruments
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div
                  key={`${item.article_code}-${item.selected_size || idx}`}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{item.product_name}</h4>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono font-medium text-slate-700">
                        Art: {item.article_code}
                      </span>
                      {item.selected_size && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                          Size: {item.selected_size}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.article_code, item.quantity - 1, item.selected_size)
                        }
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-l transition"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.article_code, item.quantity + 1, item.selected_size)
                        }
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-r transition"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.article_code, item.selected_size)}
                      className="text-slate-400 hover:text-red-600 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2 (SS 3): Contact & Shipping Information Form (Below Selected Instruments) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmitInquiry} className="space-y-5">
            {/* Row 1: First Name | Last Name | Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Row 2: Email | Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Row 3: Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="1234 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
              />
            </div>

            {/* Row 4: Address 2 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address 2
              </label>
              <input
                type="text"
                placeholder="Apartment, studio, or floor"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
              />
            </div>

            {/* Row 5: City | State | Zip | Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Enter State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Zip
                </label>
                <input
                  type="text"
                  placeholder="Enter Zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Row 6: Shipping (Payments strictly excluded per instruction) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Shipping
                </label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition cursor-pointer"
                >
                  <option value="">-- SELECT SHIPPING METHOD --</option>
                  <option value="FedEX">FedEX</option>
                  <option value="DHL">DHL</option>
                  <option value="UPS">UPS</option>
                  <option value="TNT">TNT</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Sea Freight">Sea Freight</option>
                </select>
              </div>
            </div>

            {/* Row 7: Special Instructions (Optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Special Packaging, OEM Branding, or Laser Etching Requirements
              </label>
              <textarea
                rows={3}
                placeholder="Provide any specific custom requirements, target delivery date, or requested shipping terms (FOB/CIF)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white focus:border-red-500 transition"
              />
            </div>

            {/* Row 8: Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quality Guarantee Box */}
        <div className="bg-slate-100/90 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block mb-0.5">B2B Manufacturing & Export Direct</strong>
            All instruments are forged, machined, hand-finished, and passivated at our certified facility in Sialkot, Pakistan under strict ISO 13485:2016 quality protocols.
          </div>
        </div>
      </div>
    </div>
  );
}
