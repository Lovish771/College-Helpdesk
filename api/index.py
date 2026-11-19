import sys
import os

# Ensure root and backend directories are in python search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Support both `backend.app` and legacy `app` imports
try:
    import backend.app as backend_app
    sys.modules.setdefault('app', backend_app)
    from backend.app import create_app, db
except Exception:
    from app import create_app, db

# Initialize Flask application for Vercel Serverless WSGI
app = create_app()

# On Vercel serverless cold start, ensure database tables exist cleanly
with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"[Vercel Serverless] Table create notice: {e}")
