from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

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
            # Vercel serverless environment: only /tmp is writable
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/lpu_helpdesk.db'
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
