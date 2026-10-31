from pydantic import BaseModel
from typing import List, Optional

class PredictRequest(BaseModel):
    text: str
    show_vanilla: Optional[bool] = True

class RegionalPerspective(BaseModel):
    region_id: int
    region_key: str
    region_name_bn: str
    probability: float
    probability_pct: float
    is_offensive: bool
    label: str
    label_bn: str
    human_ground_truth_rate: float
    sociolinguistic_profile: str

class SyntaxInsight(BaseModel):
    pronoun_form: str
    pronoun_tier_bn: str
    sentence_mood: str
    sentence_mood_bn: str
    target_entity: str
    target_entity_bn: str

class CommonsenseInsight(BaseModel):
    intent: str
    intent_bn: str
    react: str
    react_bn: str
    attr: str
    attr_bn: str

class VanillaComparison(BaseModel):
    probability: float
    probability_pct: float
    label: str
    is_flat: bool
    explanation: str

class PredictResponse(BaseModel):
    text: str
    perspectives: List[RegionalPerspective]
    is_contested_split: bool
    split_summary: str
    syntax: SyntaxInsight
    commonsense: CommonsenseInsight
    vanilla_comparison: Optional[VanillaComparison] = None
    model_engine_status: str

class BenchmarkSentence(BaseModel):
    id: int
    text: str
    description: str
    category: str
    expected_split: str

class FeedbackRequest(BaseModel):
    sentence: str
    user_region: str
    user_verdict: str
    rating: int
    is_contested_split: Optional[bool] = False
    comment: Optional[str] = ""

class FeedbackResponse(BaseModel):
    status: str
    message: str
    feedback_id: int
    total_feedbacks: int

