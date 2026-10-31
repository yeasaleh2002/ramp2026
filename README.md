# RAMP26: Region-Aware Multi-Perspective NLP Framework 🇧🇩

> **A Region-Aware and Socio-Syntactic Multi-Perspective Offensive-Language Detection Framework for Bengali**  
> *Undergraduate Project Report / Thesis Implementation*  
> **Department of Computer Science & Engineering, City University, Dhaka, Bangladesh** (30 October 2026)

---

## 👥 Authors & Supervision

* **Fazle Rabbi** (ID: 0272310005101025)
* **Yeasaleh** (ID: 0272310005101123)
* **Naimur Rahman Hridoy** (ID: 0272310005101124)
* **MD: Alif** (ID: 0272310005101152)

**Supervised by:**  
**Rafia Sultana**, Lecturer, Department of Computer Science and Engineering, City University  
**Department Head:** Engr. S. M. Anisur Rahman, Associate Professor & Head, Dept. of CSE

---

## ⚡ Quick Start: How to Run Locally (লোকালি চালানোর নিয়ম)

Make sure you have **Python (3.9+)** and **Node.js (v18+)** installed on your system.

### 1. Start the Backend Server (FastAPI)

Open a terminal or Command Prompt:

```bash
# Navigate to the backend directory
cd backend

# Install required Python dependencies
pip install -r requirements.txt

# Start the backend server
python run.py
```

* 🚀 **Backend Live on:** `http://localhost:8000`
* 📖 **Interactive Swagger API Docs:** `http://localhost:8000/docs`
* 💾 **Local Feedback DB:** Automatically stored in `backend/app/feedback.db` (SQLite)

---

### 2. Start the Frontend Chatbot (React + Vite)

Open a **new separate terminal** or Command Prompt:

```bash
# Navigate to the frontend directory
cd frontend

# Install npm packages (only needed the first time)
npm install

# Start the Vite development server
npm run dev
```

* 🌐 **Frontend Chatbot Live on:** `http://localhost:5173`
* Open `http://localhost:5173` in your browser to interact with the RAMP26 Chatbot!

---

## 💡 How It Works (মডেল আর্কিটেকচার ও ফিচার)

1. **Dual-Corpus Training (৪,২০০ বাংলা ডেটা):**
   * **Baseline 3K Dataset:** ৩,০০০টি মন্তব্য (Offensive Rate: ৭৪.০%)
   * **Aligned Cross-Regional Benchmark:** ১,২০০টি রো (৩০০ বাক্য × ৪ বিভাগ: ঢাকা, চট্টগ্রাম, সিলেট, রংপুর; Offensive Rate: ৫৮.৩%)
   * **Training Performance:** **৯৩.৩% Accuracy** এবং **০.৯২৩ Macro F1**।

2. **Decoupled Dual-Stream Architecture:**
   * **Stream 1 (Semantic & Pragmatic):** Word n-grams (1-3) + Character subword n-grams (2-5) + Socio-Syntactic Honorific Parser (Table 3.3: `PRON_INTIMATE` [তুই], `PRON_HONORIFIC` [আপনি], `PRON_FAMILIAR` [তুমি], `MOOD_EXCL` [!], `TGT_SECOND`).
   * **Stream 2 (Additive Regional Logit Bias Head):** $Z = Z_{\text{text}} + b[\text{region}]$:
     * **ঢাকা (Dhaka):** $-0.32$ (মেট্রোপলিটন শহুরে পরিমণ্ডল; ইনফরমাল আড্ডায় সহনশীলতা বেশি)
     * **চট্টগ্রাম (Chattogram):** $+0.08$ (উপকূলীয় সংস্কৃতি; মধ্যম-উচ্চ সংবেদনশীলতা)
     * **সিলেট (Sylhet):** $+0.12$ (আত্মীয়তা ও সামাজিক মর্যাদাবোধে উচ্চ সংবেদনশীলতা)
     * **রংপুর (Rangpur):** $+0.28$ (রক্ষণশীল গ্রামীণ ঐতিহ্য; সর্বোচ্চ সংবেদনশীলতা)

3. **Human Feedback & Active Learning Storage:**
   * মতভেদপূর্ণ বাক্যে ব্যবহারকারীরা নিজস্ব বিভাগের রায়, ১-৫ স্টার রেটিং এবং মন্তব্য সংরক্ষণ করতে পারেন।
   * সব রেটিং স্বয়ংক্রিয়ভাবে `backend/app/feedback.db`-তে জমা হয় এবং ড্যাশবোর্ডের **"সংরক্ষিত রেটিং"** বোতাম থেকে দেখা যায়।

---

## 📁 Directory Structure

```text
ramp2026/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application & API endpoints
│   │   ├── model_engine.py      # Dual-Stream empirical inference engine
│   │   ├── syntax.py            # Socio-syntactic parser (Thesis Table 3.3)
│   │   ├── schemas.py           # Pydantic schemas (Predict, Feedback, etc.)
│   │   └── feedback_db.py       # SQLite persistence for user ratings
│   ├── saved_model/
│   │   └── ramp26_empirical_model.pkl # Trained lightweight model (0.98 MB)
│   ├── run.py                   # Server startup runner (Port 8000)
│   ├── Procfile                 # Production web server command
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Top navbar with status & modals
│   │   │   ├── ChatMessage.jsx      # Conversational speech bubbles & regional cards
│   │   │   ├── ChatFeedback.jsx     # User voting & star rating widget
│   │   │   ├── FeedbackHistoryModal.jsx # Saved ratings SQLite viewer
│   │   │   └── ResearchModal.jsx    # Thesis report metadata dialog
│   │   ├── App.jsx                  # Main Chatbot state & thread layout
│   │   ├── index.css                # Tailwind CSS styling & light mode rules
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json              # Vercel deployment routing configuration
│
├── RAMP26_thesis.pdf            # Official Undergraduate Thesis Report
├── RAMP26_final_model.ipynb     # Official Training & Evaluation Notebook
├── .gitignore                   # Git exclusion rules (node_modules, pycache, etc.)
└── README.md                    # Project documentation & run guide
```

