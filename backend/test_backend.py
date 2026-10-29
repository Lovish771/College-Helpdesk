"""
Comprehensive tests for LPU Helpdesk Flask Backend & NLP Engine.
Tests intent recognition, slot filling, all REST endpoints, and database analytics.
"""

import unittest
import json
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app import app
from backend.nlp.engine import process_chat_message, classify_intent, find_program
from backend.database.db import init_db, get_analytics

class BackendTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = app.test_client()

    def test_health_endpoint(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "online")
        self.assertIn("Lovely Professional University", data["university"])

    def test_programs_endpoint(self):
        res = self.client.get("/api/programs")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 8)
        cse = next((p for p in data if p["id"] == "btech-cse"), None)
        self.assertIsNotNone(cse)
        self.assertEqual(cse["short"], "B.Tech CSE")

    def test_single_program_endpoint(self):
        res = self.client.get("/api/programs/btech-aiml")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["id"], "btech-aiml")

    def test_admissions_endpoint(self):
        res = self.client.get("/api/admissions")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("steps", data)
        self.assertIn("deadlines", data)
        self.assertIn("faqs", data)

    def test_fees_endpoint(self):
        res = self.client.get("/api/fees")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertIn("tuition", data[0])
        self.assertIn("scholarship", data[0])

    def test_hostel_endpoint(self):
        res = self.client.get("/api/hostel")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("facilities", data)
        self.assertIn("rooms", data)

    def test_scholarships_endpoint(self):
        res = self.client.get("/api/scholarships")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(len(data) >= 4)

    def test_contact_endpoint(self):
        res = self.client.get("/api/contact")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("admissions@lpu.co.in", data["email"])

    def test_analytics_endpoint(self):
        res = self.client.get("/api/analytics")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("totals", data)
        self.assertIn("topics", data)
        self.assertIn("recent", data)

    def test_eligibility_endpoint_eligible(self):
        payload = {
            "programId": "btech-cse",
            "qualification": "10+2 (PCM)",
            "percent": "78"
        }
        res = self.client.post("/api/eligibility", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["eligible"])

    def test_eligibility_endpoint_ineligible_percent(self):
        payload = {
            "programId": "btech-cse",
            "qualification": "10+2 (PCM)",
            "percent": "52"
        }
        res = self.client.post("/api/eligibility", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertFalse(data["eligible"])

    def test_eligibility_endpoint_wrong_qualification(self):
        payload = {
            "programId": "btech-cse",
            "qualification": "Bachelor's Degree",
            "percent": "85"
        }
        res = self.client.post("/api/eligibility", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertFalse(data["eligible"])

    def test_chat_greeting(self):
        res = self.client.post("/api/chat", json={"message": "hello", "conversation_id": "test_c1"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["intent"], "greeting")
        self.assertIn("Lovely Professional University", data["reply"])

    def test_chat_slot_filling_multi_turn(self):
        cid = "multi_turn_test_session"
        # Turn 1: User asks for fee without specifying program
        res1 = self.client.post("/api/chat", json={"message": "What is the fee?", "conversation_id": cid})
        self.assertEqual(res1.status_code, 200)
        data1 = res1.get_json()
        self.assertTrue(data1["requires_slot"])
        self.assertEqual(data1["slot"], "program")
        self.assertIn("Which program", data1["reply"])

        # Turn 2: User answers with program
        res2 = self.client.post("/api/chat", json={"message": "B.Tech CSE", "conversation_id": cid})
        self.assertEqual(res2.status_code, 200)
        data2 = res2.get_json()
        self.assertFalse(data2["requires_slot"])
        self.assertEqual(data2["intent"], "fee_query")
        self.assertIn("B.Tech CSE", data2["reply"])
        self.assertIn("Tuition", data2["reply"])

    def test_chat_hostel_query(self):
        res = self.client.post("/api/chat", json={"message": "Tell me about hostel rooms and mess", "conversation_id": "test_c2"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["intent"], "hostel_query")
        self.assertIn("Uni-World", data["reply"])

    def test_chat_placement_query(self):
        res = self.client.post("/api/chat", json={"message": "What is the highest package at LPU?", "conversation_id": "test_c3"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["intent"], "placement_query")
        self.assertIn("3 Crore", data["reply"])

if __name__ == "__main__":
    unittest.main()
