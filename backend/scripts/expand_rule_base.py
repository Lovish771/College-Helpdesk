"""
Re-sync the chatbot's intent rule base into an existing database.

The rule patterns live in `data/rule_base.py`. When a rule is added or tightened
there (a new phrasing real users typed, a plural form that used to fall through),
the rows in `intent_patterns` must be updated too - `db.create_all()` only creates
missing tables, it never edits them.

Usage (from the project root):

    python backend/scripts/expand_rule_base.py            # apply
    python backend/scripts/expand_rule_base.py --dry-run  # show changes only

Every rule is upserted by intent name, so running it twice is safe and other
tables (programmes, curriculum, knowledge entries) are left alone.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app, db
from app.models import IntentPattern

try:
    from backend.data.rule_base import INTENT_PATTERNS
except ImportError:
    from data.rule_base import INTENT_PATTERNS


def sync_rule_base(dry_run=False):
    """Insert new rules and update changed ones. Returns (added, updated, unchanged)."""
    added, updated, unchanged = [], [], []

    for rule in INTENT_PATTERNS:
        name = rule['intent_name']
        existing = db.session.query(IntentPattern).filter_by(intent_name=name).first()

        if existing is None:
            added.append(name)
            if not dry_run:
                db.session.add(IntentPattern(**rule))
            continue

        if existing.patterns != rule['patterns'] or existing.priority != rule['priority']:
            updated.append(name)
            if not dry_run:
                existing.patterns = rule['patterns']
                existing.priority = rule['priority']
        else:
            unchanged.append(name)

    if not dry_run:
        db.session.commit()

    return added, updated, unchanged


def main():
    dry_run = '--dry-run' in sys.argv
    app = create_app()
    with app.app_context():
        before = IntentPattern.query.count()
        added, updated, unchanged = sync_rule_base(dry_run=dry_run)
        after = IntentPattern.query.count()

        verb = 'Would add' if dry_run else 'Added'
        print('%s %d rule(s), updated %d, unchanged %d'
              % (verb, len(added), len(updated), len(unchanged)))
        if added:
            print('  new     :', ', '.join(added))
        if updated:
            print('  changed :', ', '.join(updated))
        print('Active rules: %d -> %d%s' % (before, after, ' (dry run)' if dry_run else ''))


if __name__ == '__main__':
    main()