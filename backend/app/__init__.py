import re
import sys
import os
import tempfile
import shutil
import logging
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

# Self-alias to 'app' if loaded as 'backend.app' so legacy absolute imports resolve cleanly
cur_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(cur_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if cur_dir not in sys.path:
    sys.path.insert(0, cur_dir)

if 'app' not in sys.modules:
    try:
        import backend.app as _backend_app
        sys.modules['app'] = _backend_app
    except Exception:
        pass

db = SQLAlchemy()
logger = logging.getLogger(__name__)

def create_app(config_name=None, **kwargs):
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'lpu-cse276-dev-secret-key-2026')
    
    # Compute safe SQLite fallback path seeded from bundled database
    tmp_dir = tempfile.gettempdir()
    tmp_db = os.path.join(tmp_dir, 'lpu_helpdesk.db')
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    source_db = os.path.join(base_dir, 'lpu_helpdesk.db')
    root_source_db = os.path.abspath(os.path.join(base_dir, '..', 'backend', 'lpu_helpdesk.db'))
    
    if not os.path.exists(tmp_db):
        for candidate in [source_db, root_source_db, 'backend/lpu_helpdesk.db', 'lpu_helpdesk.db']:
            if os.path.exists(candidate):
                try:
                    shutil.copyfile(candidate, tmp_db)
                    break
                except Exception:
                    pass
    norm_tmp_db = tmp_db.replace('\\', '/')
    sqlite_fallback_uri = f'sqlite:///{norm_tmp_db}'

    if config_name == 'testing':
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        database_url = os.getenv('DATABASE_URL', '').strip()
        is_serverless = bool(os.getenv('VERCEL') or os.getenv('AWS_LAMBDA_FUNCTION_NAME'))
        driver_valid = False
        engine_options = {'pool_pre_ping': True}
        if database_url:
            if database_url.startswith('postgres://'):
                database_url = 'postgresql://' + database_url[len('postgres://'):]

            if database_url.startswith('postgresql'):
                try:
                    import psycopg  # noqa: F401
                    if '+psycopg' not in database_url and '+pg8000' not in database_url:
                        database_url = 'postgresql+psycopg://' + database_url.split('://', 1)[1]
                    driver_valid = True
                except ImportError:
                    try:
                    import psycopg2  # noqa: F401
                    driver_valid = True
                    except ImportError:
                        try:
                            import pg8000  # noqa: F401
                            database_url = 'postgresql+pg8000://' + database_url.split('://', 1)[1]
                            driver_valid = True
                        except ImportError:
                            logger.warning("PostgreSQL DATABASE_URL provided but no psycopg/psycopg2/pg8000 driver is available. Falling back to SQLite.")
                            driver_valid = False
            else:
                driver_valid = True

        if driver_valid:
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
            engine_options = {
                'pool_pre_ping': True,
                'pool_recycle': 300,
            }
            if is_serverless:
                from sqlalchemy.pool import NullPool
                engine_options['poolclass'] = NullPool
            if '+pg8000' in database_url:
                # pg8000 does not accept sslmode= in URL query or connect_args
                if '?' in database_url:
                    base_uri, qs = database_url.split('?', 1)
                    params = [p for p in qs.split('&') if p and not p.lower().startswith('sslmode=')]
                    app.config['SQLALCHEMY_DATABASE_URI'] = f"{base_uri}?{'&'.join(params)}" if params else base_uri
                if 'supabase.' in database_url or 'sslmode=require' in database_url:
                    import ssl
                    engine_options['connect_args'] = {'ssl_context': ssl.create_default_context()}
            elif 'supabase.' in database_url and 'sslmode=' not in database_url:
                engine_options['connect_args'] = {'sslmode': 'require'}
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = engine_options
        elif is_serverless:
            app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_fallback_uri
        else:
            db_path = os.path.join(base_dir, 'lpu_helpdesk.db').replace('\\', '/')
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {'pool_pre_ping': True})
    
    # CORS configuration - restrict to permitted origins with credentials support
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        re.compile(r"^https://.*\.vercel\.app$"),
    ]
    if os.getenv('FRONTEND_URL'):
        allowed_origins.append(os.getenv('FRONTEND_URL'))
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
            "connect-src 'self' https: http://localhost:5000 http://127.0.0.1:5000 http://localhost:5173 http://127.0.0.1:5173;"
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

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        logger.exception("Internal server exception: %s", e)
        return {
            'error': True,
            'code': 500,
            'name': 'Internal Server Error',
            'message': 'A temporary server error occurred. Please try again shortly.',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, 500

    # Initialize extensions with safe fallback
    try:
        db.init_app(app)
    except Exception as exc:
        logger.warning("Primary database init failed (%s). Falling back to SQLite: %s", exc, sqlite_fallback_uri)
        app.config['DB_FALLBACK_REASON'] = f"{type(exc).__name__}: {exc}"
        app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_fallback_uri
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}
        try:
            app.extensions.pop('sqlalchemy', None)
        except Exception:
            pass
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

    @app.route("/", methods=["GET"])
    def root_info():
        return {
            "status": "online",
            "service": "Lovely Professional University (LPU) Admission Helpdesk API",
            "frontend_url": "http://localhost:5173",
            "api_health": "/api/programs/health"
        }, 200
    
    # Ensure tables and migrations run safely without crashing container
    with app.app_context():
        try:
            db.create_all()
        except Exception as err:
            err_msg = re.sub(r'://[^@]+@', '://***@', str(err))
            logger.warning("Primary database connection/creation failed: %s. Falling back to SQLite: %s", err_msg, sqlite_fallback_uri)
            app.config['DB_FALLBACK_REASON'] = f"{type(err).__name__}: {err_msg}"
            app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_fallback_uri
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}
            try:
                db.engine.dispose()
            except Exception:
                pass
            try:
                app.extensions.pop('sqlalchemy', None)
                db.init_app(app)
                db.create_all()
            except Exception as err2:
                logger.error("SQLite database creation failed: %s", err2)

        try:
            from sqlalchemy import inspect, text
            inspector = inspect(db.engine)
            cols = [c['name'] for c in inspector.get_columns('conversation_sessions')]
            if 'user_id' not in cols:
                db.session.execute(text("ALTER TABLE conversation_sessions ADD COLUMN user_id INTEGER"))
                db.session.commit()
        except Exception:
            db.session.rollback()

        if config_name != 'testing':
            try:
                from app.models import (
                    Program,
                    CurriculumCourse,
                    IntentPattern,
                    KnowledgeEntry,
                    AdminUser,
                    User,
                )
                from scripts.seed_database import (
                    seed_programs,
                    seed_curriculum,
                    seed_intent_patterns,
                    seed_knowledge_entries,
                    create_admin_user,
                    seed_users,
                )
                if Program.query.count() == 0:
                    seed_programs()
                if CurriculumCourse.query.count() == 0:
                    seed_curriculum()
                if IntentPattern.query.count() == 0:
                    seed_intent_patterns()
                if KnowledgeEntry.query.count() == 0:
                    seed_knowledge_entries()
                if AdminUser.query.count() == 0:
                    create_admin_user()
                if User.query.count() < 2:
                    seed_users()
            except Exception as seed_err:
                db.session.rollback()
                logger.warning("Auto-seed check notice: %s", seed_err)
    
    return app
