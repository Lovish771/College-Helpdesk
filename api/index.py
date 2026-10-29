import sys
import os

# Ensure backend directory is in python search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app, db

# Initialize Flask application for Vercel Serverless WSGI
app = create_app()

# On Vercel serverless cold start, ensure database tables exist and seed if fresh
with app.app_context():
    try:
        from app.models import Program
        if Program.query.count() == 0:
            from scripts.seed_database import seed_programs, seed_curriculum, seed_intent_patterns, seed_knowledge_entries, create_admin_user
            seed_programs()
            seed_curriculum()
            seed_intent_patterns()
            seed_knowledge_entries()
            create_admin_user()
    except Exception as e:
        print(f"[Vercel Serverless] Seed check notice: {e}")
