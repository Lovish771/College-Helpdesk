from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load .env from project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
env_path = os.path.join(project_root, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

db = SQLAlchemy()

def create_app(config_name=None, **kwargs):
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'lpu-cse276-dev-secret-key-2026')
    if config_name == 'testing':
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        if os.getenv('DATABASE_URL'):
            app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
        elif os.getenv('VERCEL') or os.getenv('AWS_LAMBDA_FUNCTION_NAME'):
            # Vercel serverless environment: copy bundled database to /tmp if not present
            tmp_db = '/tmp/lpu_helpdesk.db'
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            source_db = os.path.join(base_dir, 'lpu_helpdesk.db')
            if not os.path.exists(tmp_db) and os.path.exists(source_db):
                import shutil
                try:
                    shutil.copyfile(source_db, tmp_db)
                except Exception:
                    pass
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{tmp_db}'
        else:
            # Use absolute or instance-relative database path so running from any directory works
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            db_path = os.path.join(base_dir, 'lpu_helpdesk.db')
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # CORS configuration - restrict to permitted origins with credentials support
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
    ]
    if os.getenv('FRONTEND_URL'):
        allowed_origins.append(os.getenv('FRONTEND_URL'))
    if os.getenv('VERCEL_URL'):
        allowed_origins.append(f"https://{os.getenv('VERCEL_URL')}")
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
    
    # Strict security headers middleware (OWASP Top 10 hardening)
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline' fonts.googleapis.com; "
            "font-src 'self' fonts.gstatic.com data:; "
            "img-src 'self' data: https: blob:; "
            "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 http://localhost:5173 http://127.0.0.1:5173;"
        )
        response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        return response

    # Centralized JSON error handling
    from datetime import datetime, timezone
    from werkzeug.exceptions import HTTPException

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return {
            'error': True,
            'code': e.code,
            'name': e.name,
            'message': e.description,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, e.code

    # Initialize extensions
    db.init_app(app)

    # Root landing and health endpoints
    from flask import request

    @app.route('/')
    @app.route('/api')
    @app.route('/api/')
    def api_root():
        if 'text/html' in request.headers.get('Accept', ''):
            html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LPU Student Helpdesk API Server</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 40px; max-width: 620px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid rgba(34, 197, 94, 0.3); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    h1 { font-size: 26px; font-weight: 800; margin: 20px 0 8px 0; letter-spacing: -0.025em; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; }
    .app-link { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; transition: background 0.2s; }
    .app-link:hover { background: #c2410c; }
    .endpoints { margin-top: 32px; border-top: 1px solid #334155; padding-top: 24px; }
    .endpoints h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 12px 0; }
    .endpoints ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .endpoints a { color: #38bdf8; text-decoration: none; font-size: 13px; font-family: monospace; padding: 6px 10px; background: #0f172a; border-radius: 8px; display: block; border: 1px solid #1e293b; }
    .endpoints a:hover { border-color: #38bdf8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Backend API Operational (Session 2026-27)</div>
    <h1>Lovely Professional University Student Helpdesk</h1>
    <p>The Flask REST API microservice is running actively on port 5000. To access the interactive student guidance interface with AI chatbot, curriculum browser, fee calculator, and comparisons, open the frontend application.</p>
    <a href="http://localhost:5173" class="app-link">🚀 Open Frontend Application (http://localhost:5173)</a>
    <div class="endpoints">
      <h3>Active API Endpoints</h3>
      <ul>
        <li><a href="/api/health">/api/health</a></li>
        <li><a href="/api/programs">/api/programs</a></li>
        <li><a href="/api/curriculum">/api/curriculum</a></li>
        <li><a href="/api/knowledge">/api/knowledge</a></li>
        <li><a href="/api/analytics">/api/analytics</a></li>
        <li><a href="/api/auth/me">/api/auth/me</a></li>
      </ul>
    </div>
  </div>
</body>
</html>"""
            return html, 200, {'Content-Type': 'text/html; charset=utf-8'}

        return {
            'service': 'Lovely Professional University Student Helpdesk API',
            'status': 'operational',
            'academicSession': '2026-27',
            'version': '2.4.0',
            'frontendUrl': 'http://localhost:5173',
            'endpoints': [
                '/api/health',
                '/api/programs',
                '/api/curriculum',
                '/api/knowledge',
                '/api/chat',
                '/api/auth/send-otp',
                '/api/auth/verify-otp',
                '/api/auth/me',
                '/api/analytics'
            ]
        }, 200

    @app.route('/health')
    def root_health():
        return {
            'status': 'healthy',
            'service': 'LPU Helpdesk Backend',
            'university': 'Lovely Professional University',
            'session': '2026-27'
        }, 200
    
    # Register blueprints
    from app.routes import chat, programs, curriculum, knowledge, feedback, admin, analytics, auth
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(chat.bp, url_prefix='/api')
    app.register_blueprint(programs.bp, url_prefix='/api')
    app.register_blueprint(curriculum.bp, url_prefix='/api')
    app.register_blueprint(knowledge.bp, url_prefix='/api')
    app.register_blueprint(feedback.bp, url_prefix='/api')
    app.register_blueprint(admin.bp, url_prefix='/api')
    app.register_blueprint(analytics.bp, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import text
            db.session.execute(text("ALTER TABLE conversation_sessions ADD COLUMN user_id INTEGER"))
            db.session.commit()
        except Exception:
            db.session.rollback()
    
    return app
