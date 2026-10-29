"""
SQLite Database module for College Helpdesk Chatbot.
Logs user conversations, detected intents, and provides dynamic analytics.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "chatbot_analytics.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL,
            user_message TEXT NOT NULL,
            bot_reply TEXT NOT NULL,
            intent TEXT NOT NULL,
            confidence REAL NOT NULL,
            is_answered INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Check if empty, seed with realistic LPU interaction records if empty
    cursor.execute("SELECT COUNT(*) AS cnt FROM interactions")
    count = cursor.fetchone()["cnt"]
    if count == 0:
        seed_data = [
            ("conv_01", "What is the fee for B.Tech CSE?", "Tuition: ₹1,40,000 / semester...", "fee_query", 0.96, 1, "2026-10-25 09:12:00"),
            ("conv_02", "Tell me about LPUNEST scholarship slabs", "LPUNEST provides up to 48% scholarship...", "scholarship_query", 0.95, 1, "2026-10-25 10:30:00"),
            ("conv_03", "Is hostel available for first year students?", "Yes, LPU Uni-World provides 1, 2, 3, and 4-seater...", "hostel_query", 0.94, 1, "2026-10-25 11:15:00"),
            ("conv_04", "What are the eligibility criteria for MBA?", "Pass with 55% in Bachelor's degree and LPUNEST/CAT...", "eligibility_query", 0.92, 1, "2026-10-25 11:45:00"),
            ("conv_05", "What is the highest placement package at LPU?", "Highest international package is ₹3 Crore...", "placement_query", 0.98, 1, "2026-10-25 12:20:00"),
            ("conv_06", "What are the admission steps for B.Tech?", "Admission process involves 6 steps...", "admission_query", 0.95, 1, "2026-10-25 13:05:00"),
            ("conv_07", "Which documents are required for counseling?", "Class 10th, 12th marksheet, LPUNEST scorecard...", "document_query", 0.93, 1, "2026-10-25 14:10:00"),
            ("conv_08", "What is the last date to apply for LPUNEST?", "Key dates: Current phase registrations are open...", "deadline_query", 0.91, 1, "2026-10-25 14:50:00"),
            ("conv_09", "Is there an on-campus swimming pool and gym?", "Yes, LPU has an Olympic-size swimming pool and indoor stadium...", "hostel_query", 0.89, 1, "2026-10-25 15:30:00"),
            ("conv_10", "Do you provide fee concession for defense personnel?", "Yes, special scholarship up to 30% for defense wards...", "scholarship_query", 0.94, 1, "2026-10-25 16:15:00"),
            ("conv_11", "Can I transfer credits from another university in second year?", "I'm sorry, I couldn't identify that enquiry...", "unknown", 0.22, 0, "2026-10-26 09:20:00"),
            ("conv_12", "What is the syllabus for the LPUNEST offline exam syllabus?", "Key dates and info...", "unknown", 0.31, 0, "2026-10-26 10:05:00"),
            ("conv_13", "Are there foreign student exchange programs with UK universities?", "I'm sorry, I couldn't identify that enquiry...", "exchange_query", 0.28, 0, "2026-10-26 11:10:00"),
            ("conv_14", "What is the fee for BCA?", "Tuition: ₹80,000 / semester...", "fee_query", 0.96, 1, "2026-10-26 11:40:00"),
            ("conv_15", "How can I contact the admission office?", "Admission helpline: +91-1824-517000...", "contact_query", 0.97, 1, "2026-10-26 12:15:00"),
        ]
        cursor.executemany("""
            INSERT INTO interactions (conversation_id, user_message, bot_reply, intent, confidence, is_answered, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, seed_data)
        conn.commit()

    conn.close()

def log_interaction(conversation_id, user_message, bot_reply, intent, confidence, is_answered):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO interactions (conversation_id, user_message, bot_reply, intent, confidence, is_answered)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (conversation_id, user_message, bot_reply, intent, float(confidence), 1 if is_answered else 0))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging interaction: {e}")

def get_analytics():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Totals
    cursor.execute("SELECT COUNT(*) AS total, SUM(is_answered) AS answered FROM interactions")
    row = cursor.fetchone()
    total = row["total"] or 0
    answered = row["answered"] or 0
    unanswered = total - answered
    rate = round((answered / total * 100), 1) if total > 0 else 100.0

    # Topic distribution
    cursor.execute("""
        SELECT 
            CASE 
                WHEN intent = 'fee_query' THEN 'Fees & Costs'
                WHEN intent = 'hostel_query' THEN 'Hostel & Living'
                WHEN intent = 'scholarship_query' THEN 'Scholarships & Aid'
                WHEN intent = 'admission_query' THEN 'Admissions & LPUNEST'
                WHEN intent = 'program_query' THEN 'Programs & Degrees'
                WHEN intent = 'eligibility_query' THEN 'Eligibility Criteria'
                WHEN intent = 'placement_query' THEN 'Placements & Careers'
                WHEN intent = 'contact_query' THEN 'Contact & Helpdesk'
                ELSE 'General Enquiries'
            END AS topic,
            COUNT(*) AS cnt
        FROM interactions
        WHERE is_answered = 1
        GROUP BY topic
        ORDER BY cnt DESC
        LIMIT 6
    """)
    topics = [[r["topic"], r["cnt"]] for r in cursor.fetchall()]

    # If no topics yet, provide defaults
    if not topics:
        topics = [["Fees & Costs", 1], ["Admissions & LPUNEST", 1]]

    # Recent unanswered or low-confidence queries
    cursor.execute("""
        SELECT user_message, intent, confidence, is_answered, date(created_at) AS dt
        FROM interactions
        WHERE is_answered = 0 OR confidence < 0.65
        ORDER BY id DESC
        LIMIT 8
    """)
    recent = []
    for r in cursor.fetchall():
        status = "Unanswered" if r["is_answered"] == 0 else "Low Confidence"
        recent.append([r["user_message"], r["intent"], status, r["dt"] or str(datetime.now().date())])

    if not recent:
        recent = [
            ["Can I get direct admission without LPUNEST?", "admission_query", "Needs review", str(datetime.now().date())]
        ]

    conn.close()
    return {
        "totals": {
            "conversations": total,
            "answered": answered,
            "rate": rate,
            "unanswered": unanswered
        },
        "topics": topics,
        "recent": recent
    }
