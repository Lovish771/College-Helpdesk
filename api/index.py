import sys
import os

# Ensure backend directory and project root are in Python search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app import create_app

# Initialize Flask application for Vercel Serverless WSGI
app = create_app()
