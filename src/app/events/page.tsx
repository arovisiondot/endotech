"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Mail,
  Send,
} from "lucide-react";
import { initialEvents } from "@/data/mockData";

export default function EventsPage() {
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const handleOpenMeeting = (eventTitle: string) => {
    setSelectedEventTitle(eventTitle);
    setMeetingModalOpen(true);
    setBookedSuccess(false);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedSuccess(true);
    setTimeout(() => {
      setMeetingModalOpen(false);
      setBookedSuccess(false);
    }, 2500);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-red-500" />
            <span>GLOBAL HEALTHCARE EXPOS</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            Upcoming Exhibitions & <span className="text-red-500">Activities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            Meet the Endo Tech executive team and master craftspeople in person at leading international medical exhibitions worldwide.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-8">
          {initialEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Event Date badge column */}
              <div className="lg:col-span-3 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-red-600 px-2.5 py-1 rounded uppercase tracking-wider">
                    {event.badge_label || "Upcoming"}
                  </span>
                  <div className="mt-6">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Dates
                    </div>
                    <div className="text-lg font-black text-white mt-1">
                      {event.start_date} &ndash; {event.end_date}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Booth Location
                  </span>
                  <span className="text-sm font-bold text-red-400 font-mono">
                    {event.booth_number}
                  </span>
                </div>
              </div>

              {/* Event Description & Actions */}
              <div className="lg:col-span-9 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">{event.title}</h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-red-600" />
                      Executive & Technical Delegation Attending
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenMeeting(event.title)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  >
                    <span>Book a Meeting at Booth</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Networking Banner */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            PRIVATE FACTORY VISITS
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            Visiting Sialkot, Pakistan?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We welcome international distributors, hospital procurement boards, and OEM partners to tour our state-of-the-art forging, CNC milling, and cleanroom packaging facilities in Sialkot.
          </p>
          <div className="pt-2">
            <Link
              href="/contact?type=factory-visit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <span>Schedule Factory Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Book Meeting Modal */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setMeetingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold"
            >
              ✕
            </button>

            {bookedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900">Meeting Request Sent!</h4>
                <p className="text-xs text-slate-500">
                  Our export director will confirm your meeting slot at {selectedEventTitle} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    RESERVE A SLOT
                  </span>
                  <h4 className="font-bold text-lg text-slate-900">
                    Book Meeting at {selectedEventTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect with our executive sales directors directly at our exhibition booth.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Company Name, Country"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  Confirm Meeting Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
