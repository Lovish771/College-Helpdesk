# LPU Admission & Student Helpdesk - Backend

Flask backend for the LPU Admission & Student Helpdesk project. This is a rule-based AI chatbot system for CSE276 - Artificial Intelligence Foundations.

## Project Overview

This backend provides:
- Rule-based AI chatbot with intent detection and slot filling
- SQLite database with knowledge base for LPU information
- REST API endpoints for chat, programs, curriculum, and analytics
- Conversation logging and feedback collection
- Admin dashboard for knowledge verification (pending implementation)

## Technology Stack

- Python 3.11+
- Flask 3.0.0
- Flask-CORS 4.0.0
- Flask-SQLAlchemy 3.1.1
- SQLAlchemy 2.0.23
- SQLite
- python-dotenv 1.0.0
- bcrypt 4.1.2
- pytest 7.4.3

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Seed the database:
```bash
python scripts/seed_database.py
```

Default admin credentials:
- Username: `admin`
- Password: `admin123` (CHANGE IN PRODUCTION)

## Running the Backend

Start the Flask development server:
```bash
python run.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Backend health status

### Chat
- `POST /api/chat` - Send message to chatbot
  - Request: `{"message": "text", "conversation_id": "optional"}`
  - Response: `{"reply": "...", "conversation_id": "...", "intent": "...", "confidence": 0.9, "requires_slot": false, "slot": null, "suggestions": [...]}`
- `GET /api/conversations/<conversation_id>` - Get conversation history
- `DELETE /api/conversations/<conversation_id>` - Delete conversation

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs/<program_id>` - Get program details
- `GET /api/programs/search?q=query` - Search programs

### Curriculum
- `GET /api/curriculum?program=...&semester=...` - Get curriculum with filters
- `GET /api/curriculum/programs` - Get programs with curriculum data

### Knowledge Base
- `GET /api/knowledge/categories` - Get knowledge categories
- `GET /api/knowledge/search?q=...&category=...` - Search knowledge base

### Feedback
- `POST /api/feedback` - Submit feedback on response

### Analytics
- `GET /api/analytics` - Get analytics data

### Admin (Pending Implementation)
- `GET /api/admin/dashboard` - Admin dashboard (requires authentication)

## Database Schema

### Tables
- `programs` - Programme information
- `curriculum_courses` - Semester-wise curriculum
- `knowledge_entries` - Knowledge base entries
- `knowledge_sources` - Source references
- `intent_patterns` - Intent detection patterns
- `conversation_sessions` - Conversation sessions
- `conversation_messages` - Message logs
- `feedback` - User feedback
- `unanswered_queries` - Unanswered question tracking
- `admin_users` - Admin accounts
- `audit_logs` - Audit trail

## Rule-Based AI Engine

The chatbot uses a rule-based approach:

1. **Intent Detection**: Regex patterns match user queries to intents
2. **Entity Extraction**: Extracts programs, semesters, fee types from messages
3. **Slot Filling**: Asks follow-up questions for missing information
4. **Context Management**: Maintains conversation context across turns
5. **Rule Evaluation**: IF-THEN rules generate responses
6. **Knowledge Retrieval**: Fetches answers from verified knowledge base

### Supported Intents
- greeting, goodbye
- programme_information
- admission_process
- eligibility
- fees
- scholarships
- hostel
- curriculum
- semester_subjects
- course_credits
- documents
- entrance_exam
- campus_life
- placements
- academic_support
- contact_support
- unknown

## Verification Status

All information in the database is marked with verification status:
- `verified_official` - Verified from official LPU sources
- `secondary_source` - From reliable secondary sources
- `needs_review` - Requires verification
- `expired` - Information has expired

## Testing

Run pytest tests:
```bash
pytest tests/
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── config.py             # Configuration
│   ├── models/               # Database models
│   ├── routes/               # API blueprints
│   ├── services/             # Business logic
│   ├── repositories/         # Data access layer
│   └── utils/                # Utilities
├── migrations/               # Database migrations
├── scripts/                  # Utility scripts
│   └── seed_database.py      # Database seeding
├── tests/                    # Unit tests
├── requirements.txt          # Python dependencies
├── .env.example              # Environment template
├── .env                      # Environment variables (gitignored)
└── run.py                    # Application entry point
```

## Security Notes

- Change default admin password in production
- Use environment variables for secrets
- Enable HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use parameterized queries (ORM handles this)

## Limitations

- Admin authentication not yet implemented
- Knowledge verification workflow pending
- Rate limiting not yet implemented
- Some endpoints require additional error handling

## Future Improvements

- Complete admin authentication
- Implement knowledge verification workflow
- Add rate limiting
- Create evaluation scripts
- Add more verified LPU data
- Implement file upload for curriculum documents
- Add audit logging for all admin actions

## License

This is a college project for CSE276 - Artificial Intelligence Foundations.
