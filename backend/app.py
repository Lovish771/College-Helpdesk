"""
WSGI Entrypoint for Lovely Professional University Student Helpdesk Backend.
Initializes the application using the factory in backend/app.
"""
import os
import sys

# Ensure backend directory and project root are in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
