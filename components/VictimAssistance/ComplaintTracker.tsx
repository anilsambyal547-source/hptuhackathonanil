"use client";

import React, { useState, useEffect } from "react";
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Calendar,
  IndianRupee,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ComplaintRecord, Language } from "@/lib/types/recovery";

interface ComplaintTrackerProps {
  language: Language;
}

const STORAGE_KEY = "safeguard_complaint_records_v1";

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({ language }) => {
  const isHi = language === "hi";

  const [records, setRecords] = useState<ComplaintRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAck, setNewAck] = useState("");
  const [newAuthority, setNewAuthority] = useState("National Cyber Crime Reporting Portal (1930)");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newAmount, setNewAmount] = useState("");
  const [newStatus, setNewStatus] = useState<ComplaintRecord["status"]>("Filed / Pending");
  const [newFollowUp, setNewFollowUp] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const saveToStorage = (updated: ComplaintRecord[]) => {
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAck.trim()) return;

    const record: ComplaintRecord = {
      id: `complaint-${Date.now()}`,
      acknowledgementNumber: newAck.trim(),
      authorityName: newAuthority,
      portalUrl: newAuthority.includes("Cyber")
        ? "https://cybercrime.gov.in"
        : newAuthority.includes("RBI")
        ? "https://cms.rbi.org.in"
        : newAuthority.includes("SEBI")
        ? "https://scores.sebi.gov.in"
        : "https://consumerhelpline.gov.in",
      category: "banking_upi",
      dateFiled: newDate,
      amountReported: newAmount.trim() || "0",
      status: newStatus,
      followUpDate: newFollowUp,
      notes: newNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    saveToStorage([record, ...records]);
    setNewAck("");
    setNewAmount("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const handleDeleteRecord = (id: string) => {
    saveToStorage(records.filter((r) => r.id !== id));
  };

  const handleUpdateStatus = (id: string, status: ComplaintRecord["status"]) => {
    saveToStorage(records.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#edf1e8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#3d5926]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#181a15]">
              {isHi ? "5. अपनी दर्ज शिकायतों को ट्रैक करें (Complaint Tracker)" : "5. Track Your Official Complaints"}
            </h3>
          </div>
          <p className="text-xs text-[#636c5c] mt-1">
            {isHi
              ? "साइबर सेल, बैंक अथवा RBI से मिली पावती संख्या (Acknowledgement Number) यहाँ सहेजें ताकि फॉलो-अप आसान हो सके।"
              : "Store and track your NCRP, Bank Grievance, and Banking Ombudsman ticket numbers locally."}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-xs font-bold text-[#162704] border border-[#a8df4a]/70 shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? (isHi ? "बंद करें" : "Cancel") : (isHi ? "नई पावती जोड़ें" : "Add Complaint Ticket")}</span>
        </button>
      </div>

      {/* Add New Ticket Modal / Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleAddRecord}
          className="p-5 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] space-y-4 text-xs animate-in fade-in duration-200 shadow-2xs"
        >
          <h4 className="font-bold text-[#181a15] flex items-center gap-2 text-sm">
            <span>{isHi ? "नई शिकायत पावती विवरण दर्ज करें" : "Enter Official Complaint Record"}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "शिकायत पावती संख्या (Ack Number)" : "Acknowledgement / Reference Number *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2090124001928"
                value={newAck}
                onChange={(e) => setNewAck(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "प्राधिकरण / बैंक का नाम" : "Authority / Bank Name"}
              </label>
              <select
                value={newAuthority}
                onChange={(e) => setNewAuthority(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              >
                <option value="National Cyber Crime Reporting Portal (1930)">
                  National Cyber Crime Portal (1930 / cybercrime.gov.in)
                </option>
                <option value="Home Bank Formal Grievance Cell">Home Bank Formal Grievance Desk</option>
                <option value="RBI Banking Ombudsman (CMS)">RBI Banking Ombudsman (cms.rbi.org.in)</option>
                <option value="SEBI SCORES 2.0">SEBI SCORES 2.0 (scores.sebi.gov.in)</option>
                <option value="National Consumer Helpline (NCH)">National Consumer Helpline (1915)</option>
                <option value="Local Police Station / Cyber Cell">Local Police Station / Cyber Cell</option>
              </select>
            </div>

            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "शिकायत दर्ज करने की तारीख" : "Date Filed"}
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "दर्ज की गई विवादित राशि (₹)" : "Disputed Amount (₹)"}
              </label>
              <input
                type="text"
                placeholder="e.g. 45000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "वर्तमान स्थिति (Status)" : "Current Status"}
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintRecord["status"])}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              >
                <option value="Filed / Pending">Filed / Pending (दर्ज / विचाराधीन)</option>
                <option value="Under Investigation">Under Investigation (जांच जारी)</option>
                <option value="Escalated">Escalated to Nodal Officer (एस्केलेटेड)</option>
                <option value="Resolved">Resolved / Refund Credited (निस्तारित)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "अगला फॉलो-अप / स्मरण तारीख" : "Next Follow-Up Date"}
              </label>
              <input
                type="date"
                value={newFollowUp}
                onChange={(e) => setNewFollowUp(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[#181a15] font-semibold mb-1">
                {isHi ? "टिप्पणी / पुलिस अधिकारी का नाम / फोन" : "Notes / Investigating Officer Contact"}
              </label>
              <input
                type="text"
                placeholder="e.g. Spoke to SI Sharma at Cyber Police Station; bank assigned Nodal Officer ticket #4928"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-white border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] text-xs focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] shadow-2xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#dce3d5] text-[#556149] hover:text-[#181a15]"
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#bef264] hover:bg-[#aee750] text-[#162704] font-bold border border-[#a8df4a]/70 shadow-2xs transition-all"
            >
              {isHi ? "पावती सुरक्षित करें" : "Save Complaint Record"}
            </button>
          </div>
        </form>
      )}

      {/* Records Table / List */}
      {records.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-[#ccd4c4] bg-[#f9faf7] space-y-2">
          <BookmarkCheck className="w-8 h-8 text-[#8c9682] mx-auto" />
          <h4 className="text-sm font-semibold text-[#181a15]">
            {isHi ? "कोई शिकायत रिकॉर्ड नहीं मिला" : "No complaint tickets logged yet"}
          </h4>
          <p className="text-xs text-[#636c5c] max-w-md mx-auto">
            {isHi
              ? "जब आप 1930 या cybercrime.gov.in पर शिकायत दर्ज करते हैं, तो SMS में मिली पावती संख्या को यहाँ दर्ज करें।"
              : "When you dial 1930 or file on cybercrime.gov.in, save your ticket number here to keep track of follow-up dates and status."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-[#f8faf6] border border-[#e2e7dc] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-[#2c401c] bg-[#eef4e8] px-2.5 py-0.5 rounded-md border border-[#d5e0cb]">
                    #{rec.acknowledgementNumber}
                  </span>
                  <span className="font-semibold text-[#181a15]">{rec.authorityName}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      rec.status === "Resolved"
                        ? "bg-[#eef5e6] text-[#2c401c] border border-[#cbe0b8]"
                        : rec.status === "Escalated"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-[#f4f7f1] text-[#363f2e] border border-[#dde4d4]"
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[#636c5c] text-[11px] flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#717a69]" />
                    <span>{isHi ? "दर्ज:" : "Filed:"} {rec.dateFiled}</span>
                  </span>

                  {rec.amountReported !== "0" && (
                    <span className="flex items-center gap-1 text-[#181a15] font-semibold">
                      <IndianRupee className="w-3 h-3 text-rose-600" />
                      <span>₹{rec.amountReported}</span>
                    </span>
                  )}

                  {rec.followUpDate && (
                    <span className="flex items-center gap-1 text-amber-800 font-medium">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{isHi ? "फॉलो-अप:" : "Follow-Up by:"} {rec.followUpDate}</span>
                    </span>
                  )}
                </div>

                {rec.notes && (
                  <p className="text-[#525a4c] italic pt-1 border-t border-[#e2e7dc]">
                    &ldquo;{rec.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <select
                  value={rec.status}
                  onChange={(e) =>
                    handleUpdateStatus(rec.id, e.target.value as ComplaintRecord["status"])
                  }
                  className="bg-white border border-[#d8e0d0] rounded-xl px-2.5 py-1 text-[#181a15] text-xs focus:outline-none shadow-2xs"
                >
                  <option value="Filed / Pending">Filed / Pending</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <a
                  href={rec.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white border border-[#d8e0d0] text-[#3d5926] hover:bg-[#edf2e7] shadow-2xs"
                  title="Visit Portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-2 rounded-xl bg-white border border-[#d8e0d0] text-rose-600 hover:bg-rose-50 shadow-2xs"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
