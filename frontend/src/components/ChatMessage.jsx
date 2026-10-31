import React, { useState } from 'react';
import { Bot, User, MapPin, CheckCircle, AlertCircle, Sparkles, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import ChatFeedback from './ChatFeedback';

export default function ChatMessage({ message, onSelectSample, apiBaseUrl }) {
  const [showDetails, setShowDetails] = useState(false);
  const isBot = message.sender === 'bot';

  if (!isBot) {
    return (
      <div className="flex justify-end gap-2.5 sm:gap-3 my-4 animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[70%] bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-3.5 sm:p-4 shadow-xs">
          <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
            {message.text}
          </p>
          <span className="text-[10px] text-indigo-200 mt-1 block text-right font-sans">
            {message.time || 'এখন'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  if (message.isWelcome) {
    return (
      <div className="flex justify-start gap-2.5 sm:gap-3 my-4 animate-fade-in">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="max-w-[95%] sm:max-w-[80%] bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              RAMP26 এআই চ্যাটবট 🇧🇩
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              City University NLP
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            স্বাগতম! আমি <strong>RAMP26</strong> চ্যাটবট। যেকোনো বাংলা বাক্য, ফেসবুক কমেন্ট বা কথ্য রূপ এখানে লিখুন — আমি সাথে সাথে <strong>ঢাকা, চট্টগ্রাম, সিলেট ও রংপুর</strong> বিভাগের মানুষের নিজস্ব দৃষ্টিভঙ্গি অনুযায়ী বাক্যটি বিশ্লেষণ করব।
          </p>
        </div>
      </div>
    );
  }

  const res = message.result;
  if (!res) return null;

  const perspectives = res.perspectives || [];
  const isContested = res.is_contested_split;
  const safeRegions = perspectives.filter(p => !p.is_offensive).map(p => p.region_name_bn);
  const offRegions = perspectives.filter(p => p.is_offensive).map(p => p.region_name_bn);

  return (
    <div className="flex justify-start gap-2.5 sm:gap-3 my-5 animate-fade-in">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <div className="max-w-[98%] sm:max-w-[85%] bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-slate-800 space-y-4">
        
        {isContested ? (
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase tracking-wide">
                ⚡ আঞ্চলিক মতভেদ ধরা পড়েছে (Contested Split)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed mt-1">
              {res.split_summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-amber-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-white/70 p-1.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>নিরাপদ:</strong> {safeRegions.join(', ') || 'নেই'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-800 bg-white/70 p-1.5 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span><strong>আপত্তিকর:</strong> {offRegions.join(', ') || 'নেই'}</span>
              </div>
            </div>
          </div>
        ) : offRegions.length === 0 ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm">সকল বিভাগেই নিরাপদ (Safe)</h5>
              <p className="text-[11px] sm:text-xs text-emerald-700">ঢাকা, চট্টগ্রাম, সিলেট ও রংপুর সব অঞ্চলেই এটি শালীন বাক্য হিসেবে মূল্যায়িত হয়েছে।</p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm">সকল বিভাগেই আপত্তিকর (Offensive)</h5>
              <p className="text-[11px] sm:text-xs text-rose-700">উচ্চমাত্রার আক্রমণাত্মক শব্দযুক্ত মন্তব্য হওয়ায় সব অঞ্চলেই এটি ক্ষতিকর হিসেবে বিবেচিত।</p>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>৪টি প্রশাসনিক বিভাগের দৃষ্টিভঙ্গি:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              (৫০% এর বেশি হলে আপত্তিকর)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {perspectives.map((p) => {
              const isOff = p.is_offensive;
              const prob = p.probability_pct;
              return (
                <div
                  key={p.region_id}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    isOff
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-emerald-50/50 border-emerald-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">
                        {p.region_name_bn}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isOff 
                          ? 'bg-rose-100 text-rose-700 border-rose-200' 
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                        {isOff ? 'আপত্তিকর' : 'নিরাপদ'}
                      </span>
                    </div>

                    <div className="my-2">
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                        <span>ঝুঁকি:</span>
                        <span className={`font-bold font-sans ${isOff ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {prob}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOff ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(Math.max(prob, 5), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-600 mt-1 leading-snug bg-white/80 p-1.5 rounded border border-slate-100">
                    {p.sociolinguistic_profile}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <ChatFeedback
          sentence={res.text}
          isContested={isContested}
          apiBaseUrl={apiBaseUrl}
        />

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showDetails ? 'ভাষাতাত্ত্বিক তথ্য লুকান' : 'ভাষাতাত্ত্বিক ব্যাকরণ ও ভ্যানিলা মডেল তুলনা দেখুন'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">সর্বনাম ও ভাবার্থ:</span>
                  <p className="text-slate-600">স্তর: <strong>{res.syntax?.pronoun_tier_bn}</strong></p>
                  <p className="text-slate-600">মেজাজ: {res.syntax?.sentence_mood_bn}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">সামাজিক উদ্দেশ্য:</span>
                  <p className="text-slate-600">উদ্দেশ্য: {res.commonsense?.intent_bn}</p>
                  <p className="text-slate-600">প্রতিক্রিয়া: {res.commonsense?.react_bn}</p>
                </div>
              </div>

              {res.vanilla_comparison && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">প্রচলিত এআই মডেলের সাথে তুলনা:</span>
                  <p className="text-slate-600 leading-relaxed">
                    প্রচলিত ভ্যানিলা XLM-RoBERTa সব অঞ্চলের জন্য একটাই ফ্ল্যাট সিদ্ধান্ত (<strong>{res.vanilla_comparison.probability_pct}%</strong>) দেয়। পক্ষান্তরে RAMP26 আঞ্চলিক বৈচিত্র্য নিখুঁতভাবে ধারণ করে।
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

