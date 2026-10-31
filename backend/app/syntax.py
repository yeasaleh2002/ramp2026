import re
from typing import Tuple, Dict

# Regex patterns matching Thesis Table 3.3
INT_BN = r"(তুই|তোরা|তোকে|তোর|তোদের|তুরে)"
FAM_BN = r"(তুমি|তোমরা|তোমাকে|তোমার|তোমাদের)"
HON_BN = r"(আপনি|আপনারা|আপনাকে|আপনার|আপনাদের)"
SELF_BN = r"(আমি|আমাকে|আমারে|আমার|আমায়|নিজেই|নিজেকে|নিজের|নিজে)"

def extract_syntax(text: str) -> Tuple[str, str, str]:
    t = str(text).lower()
    mood = "Exclamatory" if ("!" in t or "¡" in t) else ("Interrogative" if ("?" in t or "¿" in t) else "Declarative")
    
    if re.search(INT_BN, t):
        pron = "Intimate"
        tgt = "Second_Person"
    elif re.search(HON_BN, t):
        pron = "Honorific"
        tgt = "Second_Person"
    elif re.search(FAM_BN, t):
        pron = "Familiar"
        tgt = "Second_Person"
    elif re.search(SELF_BN, t):
        pron = "None"
        tgt = "Self"
    else:
        pron = "None"
        tgt = "Third_Person"
        
    return pron, mood, tgt

def get_syntax_details(text: str) -> Dict[str, str]:
    pron, mood, tgt = extract_syntax(text)
    
    tier_map = {
        "Intimate": "তুই (ঘনিষ্ঠ / অধস্তন সম্বোধন - Tui tier)",
        "Honorific": "আপনি (সম্মানসূচক / আনুষ্ঠানিক সম্বোধন - Apni tier)",
        "Familiar": "তুমি (সাধারণ পরিচিত সম্বোধন - Tumi tier)",
        "None": "অনুল্লেখিত / তৃতীয় পক্ষ (No overt second person)"
    }
    
    mood_map = {
        "Exclamatory": "বিস্ময়সূচক / ক্ষোভ / উত্তেজনা (!)",
        "Interrogative": "প্রশ্নবোধক (?)",
        "Declarative": "বিবৃতিমূলক (সাধারণ বাক্য)"
    }
    
    target_map = {
        "Second_Person": "অন্য ব্যক্তির প্রতি সরাসরি (Direct 2nd Person)",
        "Self": "নিজের প্রতি নির্দেশিত (Self-directed)",
        "Third_Person": "সাধারণ বা পরোক্ষ উদ্দেশ্য (3rd Person / Unaddressed)"
    }
    
    return {
        "pronoun_form": pron,
        "pronoun_tier_bn": tier_map.get(pron, "সাধারণ"),
        "sentence_mood": mood,
        "sentence_mood_bn": mood_map.get(mood, "বিবৃতিমূলক"),
        "target_entity": tgt,
        "target_entity_bn": target_map.get(tgt, "সাধারণ")
    }

