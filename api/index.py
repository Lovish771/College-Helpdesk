import sys
import os

# Ensure backend directory and project root are in Python search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app import create_app, db

# Initialize Flask application for Vercel Serverless WSGI
app = create_app()

# On Vercel serverless cold start, ensure database tables exist and seed if completely fresh
with app.app_context():
    try:
        from app.models import Program
        if Program.query.count() == 0:
            try:
                from scripts.seed_database import seed_programs, seed_curriculum, seed_intent_patterns, seed_knowledge_entries, create_admin_user
            except ImportError:
                from backend.scripts.seed_database import seed_programs, seed_curriculum, seed_intent_patterns, seed_knowledge_entries, create_admin_user
            seed_programs()
            seed_curriculum()
            seed_intent_patterns()
            seed_knowledge_entries()
            create_admin_user()
    except Exception as e:
        print(f"[Vercel Serverless] Seed check notice: {e}")
