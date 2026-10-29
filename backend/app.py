"""
Flask Backend API for Lovely Professional University (LPU) Admission Helpdesk.
Provides REST endpoints for chat, program catalogues, fees, admissions,
hostel accommodations, eligibility checker, and dynamic analytics.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.data.lpu_data import (
    college,
    programs,
    fees,
    scholarships,
    hostel,
    admission_steps,
    deadlines,
    faqs,
    documents,
    contact,
    placements,
    qualifications,
)
from backend.database.db import init_db, get_analytics
from backend.nlp.engine import process_chat_message

app = Flask(__name__)
# Enable CORS for all routes so the Vite frontend (port 5173) can access the API seamlessly
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database on startup
init_db()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "LPU Helpdesk Chatbot API",
        "university": college["name"],
        "version": "1.0.0"
    }), 200


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True, silent=True) or {}
    message = data.get("message", "").strip()
    conversation_id = data.get("conversation_id", "")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    reply_payload = process_chat_message(message, conversation_id)
    return jsonify(reply_payload), 200


@app.route("/api/programs", methods=["GET"])
def get_programs():
    return jsonify(programs), 200


@app.route("/api/programs/<program_id>", methods=["GET"])
def get_program_detail(program_id):
    p = next((x for x in programs if x["id"] == program_id), None)
    if not p:
        return jsonify({"error": "Program not found"}), 404
    return jsonify(p), 200


@app.route("/api/admissions", methods=["GET"])
def get_admissions():
    return jsonify({
        "steps": admission_steps,
        "deadlines": deadlines,
        "faqs": faqs,
    }), 200


@app.route("/api/fees", methods=["GET"])
def get_fees():
    fee_list = []
    for p in programs:
        f = fees.get(p["id"], {
            "tuition": "Contact Admission Office",
            "other": "₹4,500 / sem",
            "hostel": "Available",
            "scholarship": "Up to 48% via LPUNEST"
        })
        fee_list.append({
            "program": p["name"],
            "short": p["short"],
            "tuition": f["tuition"],
            "other": f["other"],
            "hostel": f["hostel"],
            "scholarship": f["scholarship"],
        })
    return jsonify(fee_list), 200


@app.route("/api/scholarships", methods=["GET"])
def get_scholarships():
    return jsonify(scholarships), 200


@app.route("/api/hostel", methods=["GET"])
def get_hostel():
    return jsonify(hostel), 200


@app.route("/api/documents", methods=["GET"])
def get_documents():
    return jsonify(documents), 200


@app.route("/api/contact", methods=["GET"])
def get_contact():
    return jsonify(contact), 200


@app.route("/api/placements", methods=["GET"])
def get_placements():
    return jsonify(placements), 200


@app.route("/api/analytics", methods=["GET"])
def analytics_endpoint():
    data = get_analytics()
    return jsonify(data), 200


@app.route("/api/eligibility", methods=["POST"])
def check_eligibility():
    data = request.get_json(force=True, silent=True) or {}
    program_id = data.get("programId")
    qualification = data.get("qualification")
    percent_str = data.get("percent")

    p = next((x for x in programs if x["id"] == program_id), None)
    if not p:
        return jsonify({"eligible": False, "message": "Selected program not found."}), 404

    try:
        percent = float(percent_str)
    except (TypeError, ValueError):
        return jsonify({"eligible": False, "message": "Please enter a valid numeric percentage."}), 400

    if qualification not in p["accepts"]:
        accepts_str = " or ".join(p["accepts"])
        return jsonify({
            "eligible": False,
            "message": f"{p['short']} requires {accepts_str}. You selected {qualification}."
        }), 200

    if percent < p["minPercent"]:
        return jsonify({
            "eligible": False,
            "message": f"Minimum qualifying requirement for {p['short']} at LPU is {p['minPercent']}%. You entered {percent}%."
        }), 200

    return jsonify({
        "eligible": True,
        "message": f"Congratulations! You meet the minimum academic requirement for {p['short']} at Lovely Professional University. You can now appear for LPUNEST to secure your admission and scholarship!"
    }), 200


if __name__ == "__main__":
    # Standard local Flask port 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
