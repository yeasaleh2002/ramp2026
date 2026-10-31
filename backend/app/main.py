from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .schemas import PredictRequest, PredictResponse, BenchmarkSentence, FeedbackRequest, FeedbackResponse
from .model_engine import predict_perspectives
from .feedback_db import save_feedback, get_all_feedbacks, get_feedback_count

app = FastAPI(
    title="RAMP26 - Region-Aware Multi-Perspective NLP Framework",
    description="API engine for Bengali Perspectivist Content Moderation (City University, Dhaka)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BENCHMARK_SAMPLES: List[BenchmarkSentence] = [
    BenchmarkSentence(
        id=1,
        text="তুই একটা চরম বলদ, মুখ বন্ধ করে বসে থাক!",
        description="ঘনিষ্ঠ সর্বনাম (তুই) ও অপশব্দের দ্বন্দ্বে ঢাকার ইনফরমাল আড্ডায় সহনশীল হলেও রংপুরে আপত্তিকর হিসেবে চিহ্নিত।",
        category="Contested Split (আঞ্চলিক মতভেদ)",
        expected_split="Dhaka: Safe | Rangpur: Offensive"
    ),
    BenchmarkSentence(
        id=2,
        text="তুমি একটা খচ্চর, তবুও তোমাকে ভালোবাসি।",
        description="ভালোবাসাপূর্ণ কৌতুক (Affectionate Banter); অনুভূতি ও আভিধানিক শব্দের দ্বিমুখী সংঘর্ষ।",
        category="Contested Split (আঞ্চলিক মতভেদ)",
        expected_split="Urban: Safe | Conservative: Offensive"
    ),
    BenchmarkSentence(
        id=3,
        text="শালির চাওয়ালের নাটক চাওয়া আজ থেকে বন্ধ",
        description="উচ্চমাত্রার আক্রমণাত্মক শব্দযুক্ত মন্তব্য; সকল অঞ্চলেই চূড়ান্তভাবে আপত্তিকর হিসেবে মূল্যায়িত।",
        category="Unambiguous Offensive (স্পষ্ট আপত্তিকর)",
        expected_split="All Divisions: Offensive"
    ),
    BenchmarkSentence(
        id=4,
        text="আরে ভাই এই মুভিগুলো হলে গিয়ে কারা দেখে একটু জানার খুব ইচ্ছা",
        description="নিরপেক্ষ কৌতূহল ও সাধারণ সামাজিক পর্যবেক্ষণ; সকল অঞ্চলেই নিরাপদ হিসেবে মূল্যায়িত।",
        category="Safe / Neutral (শালীন ও নিরাপদ)",
        expected_split="All Divisions: Safe"
    ),
    BenchmarkSentence(
        id=5,
        text="আমি নিজেই একটা মফিজ, এই সামান্য অঙ্কটা ভুল করলাম!",
        description="নিজের প্রতি নির্দেশিত স্ব-সমালোচনা (Self-directed); অপশব্দ থাকা সত্ত্বেও আক্রমণাত্মক নয়।",
        category="Self-Directed (আত্ম-সমালোচনা)",
        expected_split="All Divisions: Safe"
    )
]

@app.get("/")
def read_root():
    return {
        "framework": "RAMP26",
        "title": "A Region-Aware Multi-Perspective Framework for NLP",
        "institution": "City University, Dhaka, Bangladesh",
        "status": "Operational",
        "endpoints": {
            "predict": "POST /api/predict",
            "benchmarks": "GET /api/benchmarks",
            "feedback": "POST /api/feedback",
            "stats": "GET /api/stats"
        }
    }

@app.post("/api/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    return predict_perspectives(request.text, show_vanilla=request.show_vanilla)

@app.get("/api/benchmarks", response_model=List[BenchmarkSentence])
def get_benchmarks():
    return BENCHMARK_SAMPLES

@app.post("/api/feedback", response_model=FeedbackResponse)
def submit_feedback(fb: FeedbackRequest):
    if not fb.sentence or not fb.sentence.strip():
        raise HTTPException(status_code=400, detail="Sentence cannot be empty.")
    
    fid = save_feedback(
        sentence=fb.sentence,
        user_region=fb.user_region,
        user_verdict=fb.user_verdict,
        rating=fb.rating,
        is_contested_split=fb.is_contested_split,
        comment=fb.comment or ""
    )
    total = get_feedback_count()
    return FeedbackResponse(
        status="success",
        message="মতামত ও রেটিং সফলভাবে সংরক্ষিত হয়েছে।",
        feedback_id=fid,
        total_feedbacks=total
    )

@app.get("/api/feedback")
def fetch_feedbacks(limit: int = 50):
    return {
        "total": get_feedback_count(),
        "feedbacks": get_all_feedbacks(limit=limit)
    }

@app.get("/api/stats")
def get_statistics():
    return {
        "primary_dataset_rows": 3000,
        "cross_regional_sentences": 300,
        "total_cross_regional_evaluations": 1200,
        "contested_split_sentences": 112,
        "minority_perspective_instances": 148,
        "empirical_human_rates": {
            "Dhaka": "49.7%",
            "Chattogram": "60.0%",
            "Sylhet": "60.7%",
            "Rangpur": "63.0%"
        },
        "model_accuracy": "93.3%",
        "model_macro_f1": "0.923"
    }
