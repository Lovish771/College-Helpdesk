import re
import tempfile
from flask import Flask, jsonify, request
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

# Tables the auth/OTP, chat and admin flows depend on. Verified at startup so a
# missing table shows up in the logs instead of as an opaque 500 on first use.
REQUIRED_TABLES = [
    'email_otps', 'users', 'security_logs', 'admin_users',
    'conversation_sessions', 'conversation_messages',
    'programs', 'curriculum_courses', 'knowledge_entries',
    'intent_patterns', 'feedback',
]


def _is_serverless() -> bool:
    """True on Vercel/Lambda, where the deployment directory is read-only."""
    return bool(
        os.getenv('VERCEL') or os.getenv('VERCEL_ENV') or
        os.getenv('AWS_LAMBDA_FUNCTION_NAME') or os.getenv('NOW_REGION')
    )


def _is_relative_sqlite_url(url: str) -> bool:
    """sqlite:///foo.db resolves against the cwd; sqlite:////abs/path.db is absolute."""
    return url.startswith('sqlite:') and not url.startswith('sqlite:////')


def _temp_db_path() -> str:
    if os.name == 'nt':
        return os.path.join(tempfile.gettempdir(), 'lpu_helpdesk.db')
    return '/tmp/lpu_helpdesk.db'


def _sqlite_file_path(url: str):
    """The file a sqlite URL points at, or None for memory / non-sqlite URLs."""
    if not url.startswith('sqlite:'):
        return None
    path = url[len('sqlite:'):]
    if path.startswith('//'):
        path = path[2:]
    if not path or path == ':memory:':
        return None
    return path


def _sqlite_target_writable(url: str) -> bool:
    """False when a sqlite URL points somewhere no database file can be written."""
    path = _sqlite_file_path(url)
    if path is None:
        return True
    absolute = os.path.abspath(path)
    if os.path.exists(absolute):
        return os.access(absolute, os.W_OK)
    directory = os.path.dirname(absolute) or '.'
    return os.path.isdir(directory) and os.access(directory, os.W_OK)


def _seed_temp_db(app, source: str, tmp_db: str) -> bool:
    """
    Copy the bundled database into the writable temp path.

    The copy lands in a side file and is checked by SQLite before being put in
    place: a truncated copy still opens and answers simple queries while failing
    on later pages, which surfaced as a mystery 500 in the auth flow.
    """
    import shutil
    import sqlite3
    partial = tmp_db + '.partial'
    try:
        shutil.copyfile(source, partial)
        con = sqlite3.connect(partial)
        try:
            check = con.execute('PRAGMA integrity_check').fetchone()
        finally:
            con.close()
        if not check or check[0] != 'ok':
            app.logger.error('[DB INIT] %s failed the integrity check (%s); not using it.'
                             % (source, check[0] if check else 'no result'))
            os.remove(partial)
            return False
        os.replace(partial, tmp_db)
        app.logger.info('[DB INIT] Seeded temp database from %s' % source)
        return True
    except Exception as e:
        app.logger.error('[DB INIT] Could not seed temp database from %s: %s' % (source, e))
        try:
            if os.path.exists(partial):
                os.remove(partial)
        except Exception:
            pass
        return False


def mask_db_uri(uri) -> str:
    """Hide credentials before a database URI reaches a log line or a response."""
    if not uri:
        return ''
    return re.sub(r'://[^/@]*@', '://***@', str(uri))


def _resolve_database_uri(app) -> str:
    """
    Pick a database URI that is actually usable.

    On serverless the deployment directory is read-only, so a *relative* sqlite
    path (sqlite:///lpu_helpdesk.db - what the bundled .env ships) resolves to an
    unwritable location: reads can succeed while every INSERT fails. Such a URL is
    ignored in favour of the writable temp copy.
    """
    configured = (os.getenv('DATABASE_URL') or '').strip()

    if configured:
        if _is_serverless() and (
            _is_relative_sqlite_url(configured) or not _sqlite_target_writable(configured)
        ):
            app.logger.error(
                '[DB INIT] DATABASE_URL=%r cannot be written from a serverless deployment '
                '(only the temp directory can). Using the writable temp database instead.'
                % configured
            )
        else:
            return configured

    if _is_serverless():
        tmp_db = _temp_db_path()
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        root_source_db = os.path.abspath(os.path.join(base_dir, '..', 'backend', 'lpu_helpdesk.db'))
        if not os.path.exists(tmp_db):
            for candidate in [os.path.join(base_dir, 'lpu_helpdesk.db'), root_source_db,
                              'backend/lpu_helpdesk.db', 'lpu_helpdesk.db']:
                if os.path.exists(candidate) and _seed_temp_db(app, candidate, tmp_db):
                    break
        return 'sqlite:///' + tmp_db

    # Local development: absolute path so it works from any working directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    return 'sqlite:///' + os.path.join(base_dir, 'lpu_helpdesk.db')


def _init_database(app):
    """Create missing tables and migrate legacy columns, reporting failures loudly."""
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.error('[DB INIT] create_all failed on %s: %s: %s' % (
                mask_db_uri(app.config.get('SQLALCHEMY_DATABASE_URI')), type(e).__name__, e))

        # Legacy databases predate columns added to the models; add each only when absent
        legacy_columns = [
            ('conversation_sessions', 'user_id', 'INTEGER'),
            # Slot-filling memory for the chatbot (programme, semester, pending intent)
            ('conversation_sessions', 'context_json', 'TEXT'),
        ]
        try:
            from sqlalchemy import inspect, text
            for table, column, ddl_type in legacy_columns:
                columns = [c['name'] for c in inspect(db.engine).get_columns(table)]
                if column not in columns:
                    db.session.execute(text(
                        'ALTER TABLE %s ADD COLUMN %s %s' % (table, column, ddl_type)))
                    db.session.commit()
                    app.logger.info('[DB INIT] Added %s.%s' % (table, column))
        except Exception as e:
            try:
                db.session.rollback()
            except Exception:
                pass
            app.logger.info('[DB INIT] legacy column migration skipped: %s' % e)

        # Fail loudly at startup rather than 500-ing on the first request
        try:
            from sqlalchemy import inspect
            existing = set(inspect(db.engine).get_table_names())
            missing = [t for t in REQUIRED_TABLES if t not in existing]
            if missing:
                app.logger.error(
                    '[DB INIT] MISSING TABLES %s in %s - auth/OTP requests will fail until '
                    'these exist.' % (missing, mask_db_uri(app.config.get('SQLALCHEMY_DATABASE_URI'))))
            else:
                app.logger.info('[DB INIT] All required tables present.')
        except Exception as e:
            app.logger.error('[DB INIT] Table verification failed: %s: %s' % (type(e).__name__, e))

def create_app(config_name=None, **kwargs):
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'lpu-cse276-dev-secret-key-2026')
    if config_name == 'testing':
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = _resolve_database_uri(app)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # CORS configuration - restrict to permitted origins with credentials support
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "https://college-std-helpdesk.vercel.app",
        "https://college-helpdesk-topaz.vercel.app",
        re.compile(r"^https://.*\.vercel\.app$"),
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
            "connect-src 'self' https: http://localhost:5000 http://127.0.0.1:5000 http://localhost:5173 http://127.0.0.1:5173;"
        )
        response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        return response

    # Centralized JSON error handling
    from datetime import datetime, timezone
    from werkzeug.exceptions import HTTPException

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        err_text = e.description or e.name or 'An unexpected error occurred'
        return {
            'success': False,
            'error': err_text,
            'message': err_text,
            'code': e.code,
            'name': e.name,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, e.code

    @app.errorhandler(Exception)
    def handle_unexpected_exception(e):
        # An unhandled error must report what actually broke, not just "internal error".
        import traceback
        detail = '%s: %s' % (type(e).__name__, e)
        app.logger.error('[500] %s %s -> %s\n%s' % (
            request.method, request.path, detail, traceback.format_exc()))

        # Set EXPOSE_ERROR_DETAILS=0 once the deployment is healthy to stop echoing
        # internal messages back to browsers.
        verbose = os.getenv('EXPOSE_ERROR_DETAILS', '1') != '0'
        payload = {
            'success': False,
            'error': 'Internal server error (%s).' % type(e).__name__,
            'message': 'Internal server error (%s).' % type(e).__name__,
            'error_type': type(e).__name__,
            'detail': detail[:400] if verbose else None,
            'database': mask_db_uri(app.config.get('SQLALCHEMY_DATABASE_URI')) if verbose else None,
            'path': request.path,
            'code': 500,
            'name': 'Internal Server Error',
            'timestamp': datetime.now(timezone.utc).isoformat(),
        }
        return jsonify(payload), 500

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
    
    # Create tables / migrate legacy columns, reporting failures loudly
    _init_database(app)
    
    return app
