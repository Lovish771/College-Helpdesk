import pytest
import os
import sys

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.routes.chat import _ip_request_timestamps

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    # Reset in-memory rate limiter table before each test run
    _ip_request_timestamps.clear()
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_security_headers_present(client):
    """Verify OWASP recommended security headers are enforced on all API responses"""
    res = client.get('/api/health')
    assert res.status_code == 200
    headers = res.headers

    assert headers.get('X-Frame-Options') == 'DENY'
    assert headers.get('X-Content-Type-Options') == 'nosniff'
    assert headers.get('Referrer-Policy') == 'strict-origin-when-cross-origin'
    assert 'Strict-Transport-Security' in headers
    assert 'max-age=31536000' in headers.get('Strict-Transport-Security', '')
    assert 'Content-Security-Policy' in headers
    assert "default-src 'self'" in headers.get('Content-Security-Policy', '')

def test_cors_lockdown_permitted_origins(client):
    """Verify CORS headers correctly allow designated frontend origins"""
    res = client.get('/api/health', headers={'Origin': 'http://localhost:5173'})
    assert res.status_code == 200
    assert res.headers.get('Access-Control-Allow-Origin') == 'http://localhost:5173'

def test_cors_lockdown_unauthorized_origins(client):
    """Verify unauthorized external origins do not receive CORS authorization"""
    res = client.get('/api/health', headers={'Origin': 'https://malicious-phishing-site.com'})
    assert res.status_code == 200
    assert res.headers.get('Access-Control-Allow-Origin') != 'https://malicious-phishing-site.com'

def test_chat_message_length_limit_exceeded(client):
    """Verify chat messages longer than 500 characters are rejected with HTTP 400"""
    oversized_message = "A" * 501
    res = client.post('/api/chat', json={'message': oversized_message})
    assert res.status_code == 400
    data = res.get_json()
    assert 'error' in data
    assert '500 characters' in data['error']

def test_chat_empty_or_whitespace_message(client):
    """Verify empty or whitespace-only messages return HTTP 400"""
    res1 = client.post('/api/chat', json={'message': '   '})
    assert res1.status_code == 400
    res2 = client.post('/api/chat', json={'message': ''})
    assert res2.status_code == 400

def test_sliding_window_rate_limiter_burst(client):
    """Verify sliding-window rate limiter allows 30 requests and blocks the 31st with HTTP 429"""
    client_ip = '198.51.100.42'
    test_headers = {'X-Forwarded-For': client_ip}

    # First 30 requests should succeed
    for i in range(30):
        res = client.post('/api/chat', json={'message': 'Hello'}, headers=test_headers)
        assert res.status_code == 200, f"Request {i+1} failed unexpectedly with status {res.status_code}"

    # 31st request from same IP must be rate limited
    res_blocked = client.post('/api/chat', json={'message': 'Hello again'}, headers=test_headers)
    assert res_blocked.status_code == 429
    assert 'Retry-After' in res_blocked.headers
    retry_after = int(res_blocked.headers.get('Retry-After', 0))
    assert retry_after > 0
    data = res_blocked.get_json()
    assert 'Rate limit' in data.get('error', '')

def test_health_check_db_and_memory_metrics(client):
    """Verify /health endpoint returns db connection state and process memory metrics"""
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'healthy'
    assert data['database'] == 'connected'
    assert 'memory_mb' in data
    assert data['memory_mb'] > 0
    assert 'Lovely Professional University' in data['university']

def test_centralized_error_handler_404(client):
    """Verify 404 responses return structured JSON error payloads"""
    res = client.get('/api/nonexistent-route-xyz')
    assert res.status_code == 404
    data = res.get_json()
    assert data is not None
    # 'error' is a human-readable string (it used to be a boolean flag)
    assert isinstance(data.get('error'), str) and data['error']
    assert data.get('code') == 404
    assert 'timestamp' in data

def test_programs_search_query_capped_length(client):
    """Verify search endpoint handles long queries safely without SQL errors"""
    long_query = "engineering" + "x" * 200
    res = client.get(f'/api/programs/search?q={long_query}')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
