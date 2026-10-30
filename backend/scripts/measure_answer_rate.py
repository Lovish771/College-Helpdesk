"""
Measure the chatbot's answer rate against a fixed question set.

This drives the real `/api/chat` endpoint (rule engine, intent patterns, slot
filling - everything) and reports how many questions were answered instead of
landing on the fallback reply. Run it before and after a rule-base change to get
the before/after coverage figure the project reports.

    python backend/scripts/measure_answer_rate.py
    python backend/scripts/measure_answer_rate.py --db path/to/other.db
    python backend/scripts/measure_answer_rate.py --verbose

Questions that *should* fall back (obscure or gibberish input) are excluded from
the rate, so the number reflects coverage of answerable questions.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Questions covering every rule in the rule base.
PROBE_CASES = [
    ("greeting",      "hello"),
    ("programmes",    "What programmes do you offer?"),
    ("programme one", "Tell me about B.Tech CSE"),
    ("fees",          "What is the fee structure for B.Tech CSE?"),
    ("hostel fee",    "What is the hostel fee?"),
    ("eligibility",   "Am I eligible for B.Tech AI and Machine Learning?"),
    ("scholarships",  "What scholarship options are available?"),
    ("documents",     "What documents do I need for admission?"),
    ("deadlines",     "When is the last date to apply?"),
    ("admission",     "How do I apply for admission?"),
    ("hostel",        "Tell me about hostel facilities"),
    ("placements",    "What is the placement record?"),
    ("loan",          "Do you provide education loans?"),
    ("exam fee",      "What is the examination fee?"),
    ("laundry",       "How much does laundry cost?"),
    ("total fee",     "What is the total fees for MBA?"),
    ("curriculum",    "Show me the curriculum for BCA"),
    ("semester",      "Semester 3 curriculum for B.Tech CSE"),
    ("hostel tiers",  "What are the hostel room tiers?"),
    ("compare",       "Compare B.Tech CSE and B.Tech AI & ML"),
    ("contact",       "What is the contact number?"),
    ("transport",     "Is there a bus service from the railway station?"),
    ("mess",          "What are the mess charges?"),
    ("mess 2",        "monthly mess bill for vegetarian food"),
    ("documents 2",   "What is the admission process and required documents?"),
    ("obscure",       "Who is the vice chancellor of the university?"),
    ("gibberish",     "asdkjhasd qwerty"),
]

# Every quick-action prompt offered by the frontend - these are the questions a
# real user is most likely to send, so the bot must answer all of them.
UI_PROMPT_CASES = [
    ("ui contact",   "How do I contact Admissions Block 30 or DSR for urgent assistance?"),
    ("ui loan",      "How do I get an education loan sanction letter from LPU? What documents are needed?"),
    ("ui laundry",   "How does the automated barcode laundry facility work at LPU?"),
    ("ui faq",       "I have a query not covered in the FAQ. Can you assist me?"),
    ("ui eligib",    "What are the eligibility criteria?"),
    ("ui deadlines", "What are the key admission deadlines and scholarship cutoffs for 2026-27?"),
    ("ui hostel",    "What are the prices, electricity allowances, and booking process for Studio Apartments and AC hostels at LPU?"),
    ("ui food",      "What food courts and restaurants are available inside LPU campus?"),
    ("ui admission", "What is the complete step-by-step admission and scholarship process for 2026-27?"),
    ("ui transit",   "What is the nearest railway station or airport and how do I reach LPU campus?"),
]

# These are correctly unanswered: the bot must say so rather than invent an answer.
EXPECTED_FALLBACK = {'obscure', 'gibberish', 'ui faq'}


def main():
    if '--db' in sys.argv:
        os.environ['DATABASE_URL'] = 'sqlite:///' + os.path.abspath(
            sys.argv[sys.argv.index('--db') + 1]).replace('\\', '/')
    else:
        os.environ.pop('DATABASE_URL', None)
    os.environ.pop('VERCEL', None)

    from app import create_app
    from app.routes.chat import _ip_request_timestamps

    verbose = '--verbose' in sys.argv
    app = create_app()
    app.config['TESTING'] = True        # skip the login gate for the measurement itself
    client = app.test_client()
    print('Database:', app.config['SQLALCHEMY_DATABASE_URI'])

    # Unique per run: a repeated id would inherit the slots stored by the last run.
    import uuid
    run_id = uuid.uuid4().hex[:8]
    created = []
    rows = []
    for idx, (label, question) in enumerate(PROBE_CASES + UI_PROMPT_CASES):
        _ip_request_timestamps.clear()   # the limiter is per minute, not per suite
        # A fresh conversation per question, so context from one question cannot
        # rescue another.
        conversation_id = 'measure-%s-%d' % (run_id, idx)
        created.append(conversation_id)
        response = client.post('/api/chat', json={
            'message': question,
            'conversation_id': conversation_id,
        })
        payload = response.get_json() or {}
        intent = payload.get('intent')
        answered = response.status_code == 200 and intent not in (None, 'unknown')
        rows.append({
            'label': label,
            'http': response.status_code,
            'intent': intent,
            'confidence': payload.get('confidence'),
            'requires_slot': payload.get('requires_slot'),
            'answered': answered,
            'reply': payload.get('reply') or payload.get('error') or '',
        })

    if verbose:
        print('\n%-14s %-4s %-18s %-6s %-7s %s'
              % ('CASE', 'HTTP', 'INTENT', 'CONF', 'SLOT?', 'REPLY'))
        for row in rows:
            print('%-14s %-4s %-18s %-6s %-7s %r' % (
                row['label'], row['http'], row['intent'], row['confidence'],
                row['requires_slot'], row['reply'][:70].replace('\n', ' ')))

    answerable = [r for r in rows if r['label'] not in EXPECTED_FALLBACK]
    answered = sum(1 for r in answerable if r['answered'])
    rate = 100.0 * answered / max(len(answerable), 1)

    print('\nAnswer rate: %d/%d = %.1f%%' % (answered, len(answerable), rate))
    print('Fallbacks :', [r['label'] for r in answerable if not r['answered']] or 'none')
    print('Crashes   :', [r['label'] for r in rows if r['http'] == 500] or 'none')

    # Behaviour the project brief explicitly requires
    print('\n--- slot filling ---')
    cid = 'measure-%s-slot' % run_id
    created.append(cid)
    for question in ('How much is the fee?', 'B.Tech CSE'):
        _ip_request_timestamps.clear()
        payload = client.post('/api/chat', json={
            'message': question, 'conversation_id': cid}).get_json() or {}
        print('  %-22r intent=%-16s requires_slot=%s' % (
            question, payload.get('intent'), payload.get('requires_slot')))

    print('\n--- context carry-over ---')
    cid = 'measure-%s-context' % run_id
    created.append(cid)
    for question in ('Tell me about MBA', 'what is its fee?', 'and the eligibility?'):
        _ip_request_timestamps.clear()
        payload = client.post('/api/chat', json={
            'message': question, 'conversation_id': cid}).get_json() or {}
        print('  %-22r intent=%-16s %r' % (
            question, payload.get('intent'), (payload.get('reply') or '')[:60].replace('\n', ' ')))

    # The measurement is scratch data - leave the conversation log as it was.
    _ip_request_timestamps.clear()
    for conversation_id in created:
        client.delete('/api/conversations/%s' % conversation_id)
    print('\nCleaned up %d measurement conversation(s).' % len(created))


if __name__ == '__main__':
    main()