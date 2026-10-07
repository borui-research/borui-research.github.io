import datetime
import json
import pathlib
import urllib.request

endpoint = 'https://google-scholar-badge.vercel.app/citations?user=eAPEMPQAAAAJ'
with urllib.request.urlopen(endpoint, timeout=30) as response:
    data = json.load(response)
message = str(data.get('message', '')).replace(',', '')
if not message.isdigit():
    raise ValueError('Citation service did not return a valid count; existing data preserved.')
result = {
    'citations': int(message),
    'author_id': 'eAPEMPQAAAAJ',
    'source': 'https://scholar.google.com/citations?user=eAPEMPQAAAAJ&hl=en',
    'provider': endpoint,
    'retrieved_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
}
path = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'scholar-stats.json'
path.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
print('Updated citations:', result['citations'])
