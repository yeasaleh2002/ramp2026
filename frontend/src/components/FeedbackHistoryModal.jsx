import React, { useState, useEffect } from 'react';
import { X, Database, Star, RefreshCw, MapPin } from 'lucide-react';

export default function FeedbackHistoryModal({ isOpen, onClose, apiBaseUrl = 'http://localhost:8000' }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
    }
  }, [isOpen]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/feedback?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-800">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                সংরক্ষিত রেটিং ও মানব মূল্যায়ন ডেটাবেজ (User Ratings)
              </h3>
              <p className="text-xs text-slate-500">
                ফাইল লোকেশন: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px]">backend/app/feedback.db</code> (SQLite)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchFeedbacks}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>মোট সংরক্ষিত রেটিং: <strong className="text-slate-900 font-bold">{total} টি</strong></span>
          <span className="text-[11px] text-slate-500">
            গবেষণাপত্রের সক্রিয় শিখন (Active Learning) ও রি-ট্রেনিংয়ের জন্য ব্যবহৃত হয়
          </span>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>ডেটাবেজ লোড হচ্ছে...</span>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">এখনো কোনো রেটিং সেভ করা হয়নি।</p>
              <p className="text-[11px] text-slate-400 mt-1">
                চ্যাটবটে কোনো বাক্য পরীক্ষা করে নিচের মতামত বক্সে রেটিং ও বিভাগ সিলেক্ট করে সেভ করুন।
              </p>
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition shadow-xs text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900 text-sm">
                    "{fb.sentence}"
                  </p>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 border ${
                    fb.user_verdict === 'Safe'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {fb.user_verdict === 'Safe' ? 'নিরাপদ' : 'আপত্তিকর'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    <strong>অঞ্চল:</strong> {fb.user_region}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <strong>রেটিং:</strong> {fb.rating}/৫
                  </span>
                  {fb.is_contested_split ? (
                    <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                      মতভেদপূর্ণ বাক্য
                    </span>
                  ) : null}
                  <span className="text-slate-400 ml-auto font-sans">
                    {new Date(fb.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {fb.comment && (
                  <p className="text-slate-600 bg-slate-50 p-2 rounded-lg text-[11px] italic">
                    "{fb.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
          <p className="text-slate-500 text-[11px]">
            💡 এই ডেটা সরাসরি আপনার কম্পিউটারের লোকাল ড্রাইভে SQLite ডেটাবেজে সংরক্ষিত হচ্ছে।
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}

