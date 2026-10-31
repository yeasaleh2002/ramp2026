import React from 'react';
import { X, Award, Users, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ResearchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-slate-800">
        
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" /> B.Sc. Engineering Project Report
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              RAMP26: Region-Aware Multi-Perspective NLP Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Department of Computer Science & Engineering, City University, Dhaka (30 October 2026)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" /> গবেষকবৃন্দ (Authors)
            </h3>
            <ul className="text-xs sm:text-sm space-y-1.5 text-slate-700">
              <li><strong className="text-slate-900">Fazle Rabbi</strong> — ID: 0272310005101025</li>
              <li><strong className="text-slate-900">Yeasaleh</strong> — ID: 0272310005101123</li>
              <li><strong className="text-slate-900">Naimur Rahman Hridoy</strong> — ID: 0272310005101124</li>
              <li><strong className="text-slate-900">MD: Alif</strong> — ID: 0272310005101152</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" /> তত্ত্বাবধায়ক (Supervisor)
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900">Rafia Sultana</p>
            <p className="text-xs text-slate-600">Lecturer, Dept. of CSE, City University</p>
            <p className="text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-200">
              <strong>Department Head:</strong> Engr. S. M. Anisur Rahman, Associate Professor & Head, Dept. of CSE
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" /> মূল গবেষণা দর্শন (Data Perspectivism)
            </h4>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-slate-700">
              প্রচলিত এআই ব্যবস্থাগুলো অধিকাংশ মানুষের ভোট (Majority Voting) নিয়ে একটি মাত্র ‘একক সত্য’ নির্ধারণ করে। এতে আঞ্চলিক সংখ্যালঘু মানুষের দৃষ্টিভঙ্গি ‘নয়েজ’ হিসেবে হারিয়ে যায়। RAMP26 এই ত্রুটি দূর করে বাংলাদেশের ৪টি বিভাগের (ঢাকা, চট্টগ্রাম, সিলেট, রংপুর) নিজস্ব সংবেদনশীলতা সরাসরি মডেল করে।
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> গবেষণালব্ধ উল্লেখযোগ্য অর্জন
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800"><strong>২.৪ গুণ সংবেদনশীলতা:</strong> আঞ্চলিক বায়াস হেড ব্যবহারের মাধ্যমে সাধারণ মডেলের চেয়ে ২.৪ গুণ বেশি আঞ্চলিক বৈচিত্র্য ধারণ করতে সক্ষম।</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800"><strong>মতভেদপূর্ণ বাক্যে সফলতা:</strong> যেসব বাক্যে বিভাগগুলোর মধ্যে দ্বিমত রয়েছে, সেখানে ভ্যানিলা মডেলের ০% এর বদলে RAMP26 ৪১.২% সঠিকতা অর্জন করে।</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800"><strong>ভুল শনাক্তকরণ হ্রাস:</strong> ৩৬৫টি মিস করা গালি কমিয়ে ২৭৪-এ নিয়ে এসেছে (২৪.৯% উন্নতি)।</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800"><strong>বাস্তব মানুষের ডেটা:</strong> ঢাকায় সর্বনিম্ন ৪৯.৭% এবং রংপুরে সর্বোচ্চ ৬৩.০% আপত্তিকর মনোভাবের সাথে হুবহু সামঞ্জস্যপূর্ণ।</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>

      </div>
    </div>
  );
}
