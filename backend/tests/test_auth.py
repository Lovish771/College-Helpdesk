import pytest
import json
import time
from app import create_app, db
from app.models.user import User, EmailOTP, SecurityLog
from app.models.conversation import ConversationSession, ConversationMessage
from app.services.email_service import EmailService
from app.services.jwt_service import JWTService
from app.routes.chat import _ip_request_timestamps

@pytest.fixture
def client():
    app = create_app('testing')
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = 'test-secret-key-for-jwt-2026'
    _ip_request_timestamps.clear()

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_send_otp_success_and_cooldown(client):
    # 1. Send OTP to valid email
    res = client.post('/api/auth/send-otp', json={'email': 'student@lpu.in'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'Verification code' in data['message']

    # 2. Attempt immediately again (must trigger 30s cooldown -> 429)
    res2 = client.post('/api/auth/send-otp', json={'email': 'student@lpu.in'})
    assert res2.status_code == 429
    assert 'Please wait' in res2.get_json()['message']

def test_send_otp_invalid_email(client):
    res = client.post('/api/auth/send-otp', json={'email': 'notanemail'})
    assert res.status_code == 400
    assert res.get_json()['success'] is False

def test_verify_otp_success(client):
    email = 'freshman@lpu.co.in'
    client.post('/api/auth/send-otp', json={'email': email})

    # Retrieve created OTP from DB
    otp_record = EmailOTP.query.filter_by(email=email).first()
    assert otp_record is not None

    # Simulate entering a candidate OTP
    # We can test with known hash
    known_otp = '654321'
    otp_record.otp_hash = EmailOTP.hash_otp(known_otp)
    db.session.commit()

    # Verify
    res = client.post('/api/auth/verify-otp', json={
        'email': email,
        'otp': known_otp,
        'name': 'Aman Kumar',
        'acceptedTerms': True
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'token' in data
    assert data['user']['email'] == email
    assert data['user']['name'] == 'Aman Kumar'

def test_verify_otp_invalid_code_and_attempt_limit(client):
    email = 'target@lpu.co.in'
    client.post('/api/auth/send-otp', json={'email': email})

    otp_record = EmailOTP.query.filter_by(email=email).first()
    otp_record.otp_hash = EmailOTP.hash_otp('999999')
    db.session.commit()

    # Enter wrong code
    for i in range(5):
        res = client.post('/api/auth/verify-otp', json={'email': email, 'otp': '000000'})
        assert res.status_code == 400

    # 6th attempt should be blocked
    res6 = client.post('/api/auth/verify-otp', json={'email': email, 'otp': '999999'})
    assert res6.status_code == 400
    assert 'attempts exceeded' in res6.get_json()['error'] or 'Invalid or expired' in res6.get_json()['error']

def test_admin_metrics_access_control(client):
    # 1. Anonymous request should be denied
    res_anon = client.get('/api/admin/metrics')
    assert res_anon.status_code == 401

    # 2. Student user request should be forbidden (403)
    student_user = User(email='regular@lpu.co.in', name='Regular Student', role='student')
    db.session.add(student_user)
    db.session.commit()

    student_token = JWTService.encode({'sub': student_user.id, 'email': student_user.email, 'role': 'student'})
    res_student = client.get('/api/admin/metrics', headers={'Authorization': f'Bearer {student_token}'})
    assert res_student.status_code == 403

    # 3. Admin user request should succeed (200)
    admin_user = User(email='admin@lpu.co.in', name='System Admin', role='admin')
    db.session.add(admin_user)
    db.session.commit()

    admin_token = JWTService.encode({'sub': admin_user.id, 'email': admin_user.email, 'role': 'admin'})
    res_admin = client.get('/api/admin/metrics', headers={'Authorization': f'Bearer {admin_token}'})
    assert res_admin.status_code == 200
    assert res_admin.get_json()['success'] is True
    assert 'metrics' in res_admin.get_json()

def test_chat_and_conversation_deletion(client):
    # Create conversation and message
    conv_id = 'test-session-123'
    session = ConversationSession(id=conv_id)
    msg = ConversationMessage(session_id=conv_id, role='user', content='Hello')
    db.session.add(session)
    db.session.add(msg)
    db.session.commit()

    # Get conversation
    res_get = client.get(f'/api/conversations/{conv_id}')
    assert res_get.status_code == 200
    assert len(res_get.get_json()['messages']) == 1

    # Delete conversation
    res_del = client.delete(f'/api/conversations/{conv_id}')
    assert res_del.status_code == 200

    # Ensure deleted from database
    assert db.session.get(ConversationSession, conv_id) is None
