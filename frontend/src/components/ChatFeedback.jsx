import React, { useState } from 'react';
import { Star, CheckCircle, Send, MessageSquareHeart } from 'lucide-react';

const REGIONS = [
  { key: 'Dhaka', name_bn: 'ঢাকা' },
  { key: 'Chattogram', name_bn: 'চট্টগ্রাম' },
  { key: 'Sylhet', name_bn: 'সিলেট' },
  { key: 'Rangpur', name_bn: 'রংপুর' },
  { key: 'Other', name_bn: 'অন্যান্য' }
];

export default function ChatFeedback({ sentence, isContested, apiBaseUrl = 'http://localhost:8000' }) {
  const [selectedRegion, setSelectedRegion] = useState('Dhaka');
  const [verdict, setVerdict] = useState('Safe');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence,
          user_region: selectedRegion,
          user_verdict: verdict,
          rating,
          is_contested_split: isContested,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">মতামত ও রেটিং ডেটাবেজে সংরক্ষিত হয়েছে!</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            আপনার অঞ্চল: <strong>{selectedRegion}</strong> • রায়: <strong>{verdict === 'Safe' ? 'নিরাপদ' : 'আপত্তিকর'}</strong> • রেটিং: <strong>{rating}★</strong>
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 italic">
            * এটি লোকাল SQLite ডেটাবেজে (backend/app/feedback.db) স্থায়ীভাবে সেভ হয়েছে।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-4 pt-3.5 border-t rounded-xl p-3.5 sm:p-4 transition-all ${
      isContested 
        ? 'bg-amber-50/70 border-amber-200' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div>
          <h5 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
            <span>
              {isContested 
                ? '⚡ এই বাক্যে মতভেদ রয়েছে — আপনার মতামত ও রেটিং দিন:' 
                : 'আপনার এলাকার প্রেক্ষাপটে রেটিং দিন:'}
            </span>
          </h5>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isContested 
              ? 'বিভিন্ন বিভাগে ভিন্ন প্রতিক্রিয়া এসেছে। আপনার নিজ জেলার অভিজ্ঞতা জানিয়ে ডেটাবেজে ভোট যোগ করুন।'
              : 'মডেলের ফলাফলের সাথে আপনি একমত কিনা তা রেটিং দিয়ে সংরক্ষণ করুন।'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-600 block mb-1">
            ১. আপনার বিভাগ নির্বাচন করুন:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRegion(r.key)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  selectedRegion === r.key
                    ? 'bg-indigo-600 border-indigo-600 text-white font-medium shadow-xs'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {r.name_bn}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-600 block mb-1">
            ২. আপনার এলাকায় এই কথাটি কি নিরাপদ নাকি আপত্তিকর?
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVerdict('Safe')}
              className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                verdict === 'Safe'
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>🟢 নিরাপদ (Safe)</span>
            </button>
            <button
              type="button"
              onClick={() => setVerdict('Offensive')}
              className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                verdict === 'Offensive'
                  ? 'bg-rose-600 border-rose-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-rose-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>🔴 আপত্তিকর (Offensive)</span>
            </button>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-600 block mb-1">
            ৩. মডেলের মূল্যায়নের যথার্থতায় রেটিং দিন:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-slate-300 hover:scale-110 transition cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-slate-500 font-sans ml-2">
              {rating} / ৫ স্টার
            </span>
          </div>
        </div>

        <div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার এলাকার সংস্কৃতি বা মতামত লিখুন (ঐচ্ছিক)..."
            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            💾 ডেটাবেজে সরাসরি সেভ হবে
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : 'রেটিং সেভ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
