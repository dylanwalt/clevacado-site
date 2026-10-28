#!/usr/bin/env python3
"""Create presentation signals from the documented six-event CSV extract.

Usage: python3 tools/build_presentation_signals.py /absolute/path/to/six_event_signal_rows.csv
"""
import collections
import csv
import hashlib
import json
import math
import sys
from pathlib import Path

SOURCE_HASH = 'e2bbf8a765314c8dd7f9fdd3d8b375f1b77172cf70dc967b9bbe4641e43d9f92'
CASES = [
    ('small_drop', 'Small drop', '#b7ff5a'),
    ('medium_drop', 'Medium drop', '#ffcb74'),
    ('large_drop', 'Large drop', '#ff8c79'),
    ('rubber_mat', 'Rubber mat', '#85dcff'),
    ('tar_road', 'Tar road', '#c9a3ff'),
    ('dirt_road', 'Dirt road', '#f4a9d7'),
]
source = Path(sys.argv[1])
if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_HASH:
    raise SystemExit('Source CSV does not match the documented six-event extract')
rows = collections.defaultdict(list)
with source.open(newline='') as handle:
    for row in csv.DictReader(handle):
        rows[row['event_class']].append(row)
signals = []
for event, label, color in CASES:
    entries = rows[event]
    if len(entries) != 2000 or len({r['trial_id'] for r in entries}) != 1:
        raise SystemExit(f'Unexpected rows for {event}')
    start = float(entries[0]['time_s'])
    points = [[round(float(r['time_s']) - start, 5),
               round(math.sqrt(sum(float(r[axis]) ** 2 for axis in ('ax_g', 'ay_g', 'az_g'))), 4)]
              for r in entries]
    signals.append({'label': label, 'trial': entries[0]['trial_id'], 'color': color, 'points': points})
output = Path(__file__).resolve().parents[1] / 'public/presentation/signals.js'
output.write_text('/* Real 2-second controlled crops; resultant calculated from ax, ay, az. See PRESENTATION-NOTES.md. */\n'
                  + 'export const signals = ' + json.dumps(signals, separators=(',', ':')) + ';\n')
print(f'Wrote {len(signals)} recordings to {output}')
