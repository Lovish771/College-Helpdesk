from flask import Blueprint, request, jsonify
from app import db
from app.models import KnowledgeEntry, KnowledgeSource

bp = Blueprint('knowledge', __name__)

@bp.route('/knowledge/categories', methods=['GET'])
def get_categories():
    """Get knowledge categories"""
    categories = db.session.query(KnowledgeEntry.category).filter_by(is_active=True).distinct().all()
    return jsonify([c[0] for c in categories])

@bp.route('/knowledge/search', methods=['GET'])
def search_knowledge():
    """Search knowledge base"""
    query = request.args.get('q', '').strip()
    category = request.args.get('category')
    
    knowledge_query = KnowledgeEntry.query.filter_by(is_active=True)
    
    if category:
        knowledge_query = knowledge_query.filter_by(category=category)
    if query:
        knowledge_query = knowledge_query.filter(
            (KnowledgeEntry.question.ilike(f'%{query}%')) |
            (KnowledgeEntry.answer.ilike(f'%{query}%'))
        )
    
    entries = knowledge_query.all()
    return jsonify([e.to_dict() for e in entries])
