import pytest
import os
import sys
import json

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Program, CurriculumCourse, IntentPattern, KnowledgeEntry

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_health_check(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'healthy'
    assert 'Lovely Professional University' in data['university']

    # Root health
    res_root_health = client.get('/health')
    assert res_root_health.status_code == 200
    assert res_root_health.get_json()['status'] == 'healthy'

def test_api_root_endpoints(client):
    # Test JSON response for root
    res_json = client.get('/', headers={'Accept': 'application/json'})
    assert res_json.status_code == 200
    data = res_json.get_json()
    assert data['status'] == 'operational'
    assert '/api/programs' in data['endpoints']

    # Test HTML response for browser navigation
    res_html = client.get('/', headers={'Accept': 'text/html'})
    assert res_html.status_code == 200
    assert 'text/html' in res_html.content_type
    assert 'Lovely Professional University' in res_html.get_data(as_text=True)

def test_get_programs(client):
    res = client.get('/api/programs')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) >= 10
    cse = next((p for p in data if p['id'] == 'btech-cse'), None)
    assert cse is not None
    assert cse['short'] == 'B.Tech CSE'
    assert cse['minPercent'] == 60

def test_get_program_detail(client):
    res = client.get('/api/programs/btech-aiml')
    assert res.status_code == 200
    data = res.get_json()
    assert data['id'] == 'btech-aiml'
    assert 'Artificial Intelligence' in data['name']

def test_search_programs(client):
    res = client.get('/api/programs/search?q=management')
    assert res.status_code == 200
    data = res.get_json()
    assert any('MBA' in p['short'] or 'BBA' in p['short'] for p in data)

def test_get_admissions(client):
    res = client.get('/api/admissions')
    assert res.status_code == 200
    data = res.get_json()
    assert 'steps' in data
    assert 'deadlines' in data
    assert 'faqs' in data
    assert len(data['steps']) >= 5

def test_get_fees(client):
    res = client.get('/api/fees')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert 'tuition' in data[0]
    assert 'scholarship' in data[0]

def test_get_scholarships(client):
    res = client.get('/api/scholarships')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) >= 4
    assert any('LPUNEST' in s['name'] for s in data)

def test_get_hostel(client):
    res = client.get('/api/hostel')
    assert res.status_code == 200
    data = res.get_json()
    assert 'facilities' in data
    assert 'rooms' in data
    assert any('1-Seater' in r[0] for r in data['rooms'])

def test_get_documents(client):
    res = client.get('/api/documents')
    assert res.status_code == 200
    data = res.get_json()
    assert any('Class 10th' in d for d in data)

def test_get_contact(client):
    res = client.get('/api/contact')
    assert res.status_code == 200
    data = res.get_json()
    assert 'admissions@lpu.co.in' in data['email']
    assert '1800' in data['toll_free']

def test_get_placements(client):
    res = client.get('/api/placements')
    assert res.status_code == 200
    data = res.get_json()
    assert '3 Crore' in data['highest_international']

def test_eligibility_check_eligible(client):
    payload = {
        'programId': 'btech-cse',
        'qualification': '10+2 (PCM)',
        'percent': '75'
    }
    res = client.post('/api/eligibility', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['eligible'] is True

def test_eligibility_check_ineligible(client):
    payload = {
        'programId': 'btech-cse',
        'qualification': '10+2 (PCM)',
        'percent': '52'
    }
    res = client.post('/api/eligibility', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['eligible'] is False

def test_curriculum_endpoints(client):
    res = client.get('/api/curriculum/programs')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) > 0

    res2 = client.get('/api/curriculum?program=btech-aiml&semester=1')
    assert res2.status_code == 200
    courses = res2.get_json()
    assert len(courses) > 0
    assert any(c['code'] == 'CSE101' for c in courses)

def test_knowledge_endpoints(client):
    res = client.get('/api/knowledge/categories')
    assert res.status_code == 200
    categories = res.get_json()
    assert 'hostel' in categories
    assert 'scholarships' in categories

    res2 = client.get('/api/knowledge/search?category=hostel')
    assert res2.status_code == 200
    entries = res2.get_json()
    assert len(entries) > 0

def test_analytics_endpoint(client):
    res = client.get('/api/analytics')
    assert res.status_code == 200
    data = res.get_json()
    assert 'totals' in data
    assert 'topics' in data
    assert 'recent' in data
    assert data['totals']['rate'] > 0

def test_chat_greeting(client):
    res = client.post('/api/chat', json={'message': 'hello'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'greeting'
    assert 'Lovely Professional University' in data['reply']

def test_chat_slot_filling_flow(client):
    cid = 'pytest_slot_flow_session'
    # Turn 1: User asks for fee without specifying program
    res1 = client.post('/api/chat', json={'message': 'What is the fee structure?', 'conversation_id': cid})
    assert res1.status_code == 200
    data1 = res1.get_json()
    assert data1['requires_slot'] is True
    assert data1['slot'] == 'program'
    assert 'Which programme' in data1['reply']

    # Turn 2: User responds with program name (B.Tech CSE Core)
    res2 = client.post('/api/chat', json={'message': 'B.Tech CSE', 'conversation_id': cid})
    assert res2.status_code == 200
    data2 = res2.get_json()
    assert data2['requires_slot'] is False
    assert data2['intent'] == 'fee_query'
    assert 'B.Tech CSE' in data2['reply']
    assert '₹1,60,000' in data2['reply']

def test_chat_aiml_fee_query(client):
    # Direct query for AI & ML specialization fee
    res = client.post('/api/chat', json={'message': 'What is the fee for B.Tech AI & ML?'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'fee_query'
    assert 'Artificial Intelligence' in data['reply'] or 'AI & ML' in data['reply']
    assert '₹2,00,000' in data['reply']

def test_education_loan_query(client):
    res = client.post('/api/chat', json={'message': 'How can I apply for an education loan for LPU?'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'loan_query'
    assert 'Vidya Lakshmi' in data['reply']
    assert 'State Bank of India' in data['reply'] or 'SBI' in data['reply']

def test_hostel_apartment_and_exam_fee_queries(client):
    # Apartment hostel query
    res_hostel = client.post('/api/chat', json={'message': 'Tell me about apartment hostel and studio rooms'})
    assert res_hostel.status_code == 200
    data_hostel = res_hostel.get_json()
    assert data_hostel['intent'] == 'hostel_tier_query'
    assert 'Apartment Hostels' in data_hostel['reply']
    assert 'Studio Apartments' in data_hostel['reply']

    # Examination fee query
    res_exam = client.post('/api/chat', json={'message': 'When is the exam fee taken and how much?'})
    assert res_exam.status_code == 200
    data_exam = res_exam.get_json()
    assert data_exam['intent'] == 'exam_fee_query'
    assert '₹4,500' in data_exam['reply']
    assert 'even (second) semester' in data_exam['reply']

    # Laundry query
    res_laundry = client.post('/api/chat', json={'message': 'What are the laundry charges at LPU?'})
    assert res_laundry.status_code == 200
    data_laundry = res_laundry.get_json()
    assert data_laundry['intent'] == 'laundry_query'
    assert '₹5,400' in data_laundry['reply']

def test_fallback_unanswered_logging(client):
    # A question outside known curriculum and fees triggers fallback & logging
    res = client.post('/api/chat', json={'message': 'Can I bring my personal electric submarine to Mars orbital station?'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'unknown'
    assert 'couldn\'t identify' in data['reply'] or 'rephrase' in data['reply']

    # Verify query logged in UnansweredQuery table
    from app.models.feedback import UnansweredQuery
    unanswered = UnansweredQuery.query.filter(UnansweredQuery.query_text.ilike('%submarine%')).first()
    assert unanswered is not None
    assert unanswered.occurrence_count >= 1

def test_chat_hostel_query(client):
    res = client.post('/api/chat', json={'message': 'Tell me about hostel rooms and mess'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'hostel_query'
    assert 'Uni-World' in data['reply']

def test_chat_placement_query(client):
    res = client.post('/api/chat', json={'message': 'What is the highest package at LPU?'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['intent'] == 'placements'
    assert '3 Crore' in data['reply']

def test_feedback_submission(client):
    res = client.post('/api/feedback', json={
        'session_id': 'test_sess',
        'is_helpful': True,
        'comment': 'Very helpful LPU guidance'
    })
    assert res.status_code == 201
