import sys
import os

# Robust path discovery for Vercel Serverless
api_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(api_dir, '..'))

for p in [
    os.path.join(root_dir, 'backend'),
    root_dir,
    os.path.join(api_dir, 'backend'),
    api_dir,
]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

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
