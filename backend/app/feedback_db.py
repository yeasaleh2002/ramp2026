import sqlite3
import os
from typing import List, Dict, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "feedback.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sentence TEXT NOT NULL,
            user_region TEXT NOT NULL,
            user_verdict TEXT NOT NULL,
            rating INTEGER NOT NULL,
            is_contested_split BOOLEAN NOT NULL DEFAULT 0,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_feedback(
    sentence: str,
    user_region: str,
    user_verdict: str,
    rating: int,
    is_contested_split: bool = False,
    comment: str = ""
) -> int:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO feedbacks (sentence, user_region, user_verdict, rating, is_contested_split, comment, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (sentence, user_region, user_verdict, rating, 1 if is_contested_split else 0, comment, datetime.now().isoformat()))
    feedback_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return feedback_id

def get_all_feedbacks(limit: int = 100) -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM feedbacks ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    result = [dict(row) for row in rows]
    conn.close()
    return result

def get_feedback_count() -> int:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM feedbacks")
    count = cursor.fetchone()[0]
    conn.close()
    return count

