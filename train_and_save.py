import urllib.request
import os
import re
import pickle
import pandas as pd
import numpy as np
import scipy.sparse as sp
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

print("[*] Downloading datasets from Google Sheets...")
URL_3K = "https://docs.google.com/spreadsheets/d/1I-2e28z7ACkOeuOGEHqfdxtCh38jgROM/export?format=csv&gid=270439370"
URL_CROSS = "https://docs.google.com/spreadsheets/d/1bjUGd7GDmE6gS5OmgWnh94J1T9U6X8vWAUafoSbRPVQ/export?format=csv&gid=0"

ds3_path = r'd:\University_project\ramp2026\dataset_3k.csv'
dsx_path = r'd:\University_project\ramp2026\dataset_cross.csv'

urllib.request.urlretrieve(URL_3K, ds3_path)
urllib.request.urlretrieve(URL_CROSS, dsx_path)
print("[*] Datasets downloaded successfully.")

df3 = pd.read_csv(ds3_path)
dfx = pd.read_csv(dsx_path)

def clean_data(df, source_id):
    c_col = "Comment_Text" if "Comment_Text" in df.columns else "Comment"
    df["text"] = df[c_col].astype(str).str.strip()
    r_col = "Annotator_Rating" if "Annotator_Rating" in df.columns else "Rating"
    df["rating"] = pd.to_numeric(df[r_col], errors="coerce")
    df = df.dropna(subset=["text", "rating"]).copy()
    df["label"] = (df["rating"] >= 3.0).astype(int)
    df["source"] = source_id
    
    REGION_FIX = {
        "chittagong": "Chattogram", "chattagram": "Chattogram", 
        "barisal": "Barishal", "dacca": "Dhaka", "dhaka": "Dhaka"
    }
    if "Region" in df.columns:
        df["region"] = df["Region"].astype(str).str.strip().map(lambda r: REGION_FIX.get(r.lower(), r.title()))
    else:
        df["region"] = "Dhaka"
    return df

df3_clean = clean_data(df3, 0)
dfx_clean = clean_data(dfx, 1)

INT_BN = r"(তুই|তোরা|তোকে|তোর|তোদের|তুরে)"
FAM_BN = r"(তুমি|তোমরা|তোমাকে|তোমার|তোমাদের)"
HON_BN = r"(আপনি|আপনারা|আপনাকে|আপনার|আপনাদের)"
SELF_BN = r"(আমি|আমাকে|আমারে|আমার|আমায়|নিজেই|নিজেকে|নিজের|নিজে)"

def extract_syntax_tokens(text):
    t = str(text).lower()
    mood = "MOOD_EXCL" if ("!" in t or "¡" in t) else ("MOOD_QUES" if ("?" in t or "¿" in t) else "MOOD_DECL")
    if re.search(INT_BN, t):
        pron = "PRON_INTIMATE"
        tgt = "TGT_SECOND"
    elif re.search(HON_BN, t):
        pron = "PRON_HONORIFIC"
        tgt = "TGT_SECOND"
    elif re.search(FAM_BN, t):
        pron = "PRON_FAMILIAR"
        tgt = "TGT_SECOND"
    elif re.search(SELF_BN, t):
        pron = "PRON_NONE"
        tgt = "TGT_SELF"
    else:
        pron = "PRON_NONE"
        tgt = "TGT_THIRD"
    return f"{pron} {mood} {tgt}"

df3_clean["syntax"] = df3_clean["text"].apply(extract_syntax_tokens)
dfx_clean["syntax"] = dfx_clean["text"].apply(extract_syntax_tokens)

all_df = pd.concat([df3_clean, dfx_clean], ignore_index=True)

word_vec = TfidfVectorizer(ngram_range=(1, 3), min_df=2, sublinear_tf=True)
char_vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 5), min_df=3, sublinear_tf=True)
syntax_vec = TfidfVectorizer(ngram_range=(1, 2))

X_word = word_vec.fit_transform(all_df["text"])
X_char = char_vec.fit_transform(all_df["text"])
X_syn = syntax_vec.fit_transform(all_df["syntax"])

X_all = sp.hstack([X_word, X_char, X_syn])
y_all = all_df["label"].values

clf = LogisticRegression(C=2.5, max_iter=1000, class_weight="balanced", random_state=42)
clf.fit(X_all, y_all)

save_dir = r"d:\University_project\ramp2026\backend\saved_model"
os.makedirs(save_dir, exist_ok=True)
model_bundle = {
    "word_vec": word_vec,
    "char_vec": char_vec,
    "syntax_vec": syntax_vec,
    "clf": clf
}
with open(os.path.join(save_dir, "ramp26_empirical_model.pkl"), "wb") as f:
    pickle.dump(model_bundle, f)

print("[*] Trained model bundle saved to backend/saved_model/ramp26_empirical_model.pkl!")
