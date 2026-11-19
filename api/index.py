import sys
import os
import importlib

# Ensure backend directory is in python search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Use an explicit package import so Vercel's Python file tracer includes the
# app code under backend/. Then alias it to the legacy absolute `app.*` imports
# used throughout the existing Flask application.
backend_app = importlib.import_module('backend.app')
sys.modules['app'] = backend_app
from backend.app import create_app, db

# Initialize Flask application for Vercel Serverless WSGI
app = create_app()

# On Vercel serverless cold start, ensure database tables exist cleanly
with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"[Vercel Serverless] Table create notice: {e}")
