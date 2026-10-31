import React from 'react';
import { Bot, BookOpen, Database, Plus } from 'lucide-react';

export default function Header({ 
  onOpenResearch, 
  onOpenFeedbackHistory, 
  onNewChat,
  apiOnline 
}) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                RAMP26 চ্যাটবট
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-sans">
                  Perspectivist AI
                </span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
              <span>অঞ্চলভিত্তিক বাংলা শালীনতা পরীক্ষণ</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">City University</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onNewChat}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="নতুন আলাপ শুরু করুন"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>

          <button
            onClick={onOpenFeedbackHistory}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="সংরক্ষিত রেটিং ও ডেটাবেজ দেখুন"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">সংরক্ষিত রেটিং</span>
            <span className="sm:hidden">রেটিং</span>
          </button>

          <button
            onClick={onOpenResearch}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">থিসিস তথ্য</span>
          </button>

          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border ${
            apiOnline 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{apiOnline ? 'সার্ভার সচল' : 'অফলাইন মোড'}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
