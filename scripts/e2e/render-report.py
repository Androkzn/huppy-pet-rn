#!/usr/bin/env python3
"""Render a Maestro run's HTML report.

Called after every flow while the suite is running, so it works from whatever
exists at that moment: the run metadata, one console log per flow, the results
the runner appends as each flow settles, and the screenshots as they arrive.
"""

from __future__ import annotations

import html
import json
import re
import sys
import time
from pathlib import Path

ANSI = re.compile(r'\x1b\[[0-9;]*[A-Za-z]')
STEP = re.compile(r'^(?P<label>[A-Z][^.]*?)\.\.\.\s*(?P<status>COMPLETED|FAILED|SKIPPED|PENDING)?\s*$')
FAILURE = re.compile(r'^(Assertion is false|Element not found|.*Exception).*$')

PILL = {
    'passed': ('#1f7a45', '#dff3e6'),
    'failed': ('#a32218', '#fbe3e0'),
    'running': ('#8a5a12', '#fbeed3'),
    'pending': ('#5a5a5a', '#eceae6'),
}


def pill(status: str) -> str:
    fg, bg = PILL.get(status, PILL['pending'])
    return (
        f'<span class="pill" style="color:{fg};background:{bg}">'
        f'{html.escape(status)}</span>'
    )


def read_steps(log: Path) -> tuple[list[dict], str]:
    """The steps a flow reported, and the reason it stopped if it failed."""
    steps: list[dict] = []
    reason = ''
    for raw in log.read_text(errors='replace').splitlines():
        line = ANSI.sub('', raw).strip()
        step = STEP.match(line)
        if step:
            label = step.group('label').strip()
            status = step.group('status') or 'RUNNING'
            if steps and steps[-1]['label'] == label:
                steps[-1]['status'] = status
            else:
                steps.append({'label': label, 'status': status})
            continue
        if not reason and FAILURE.match(line):
            reason = line
    return steps, reason


def collect(run: Path) -> list[dict]:
    results = {}
    tsv = run / 'results.tsv'
    if tsv.exists():
        for line in tsv.read_text().splitlines():
            parts = line.split('\t')
            if len(parts) == 3:
                results[parts[0]] = {'status': parts[1], 'time': float(parts[2])}

    flows = []
    for log in sorted(run.glob('*.log')):
        name = log.stem
        steps, reason = read_steps(log)
        result = results.get(name, {})
        flows.append(
            {
                'name': name,
                'steps': steps,
                'reason': reason,
                'status': result.get('status', 'running'),
                'time': result.get('time', 0),
            }
        )
    return flows


def render(run: Path) -> str:
    meta = json.loads((run / 'run.json').read_text()) if (run / 'run.json').exists() else {}
    flows = collect(run)
    done = (run / '.done').exists()

    passed = sum(1 for f in flows if f['status'] == 'passed')
    failed = sum(1 for f in flows if f['status'] == 'failed')
    overall = 'failed' if failed else ('passed' if done and flows else 'running')

    shots_dir = run / 'screenshots'
    shots = sorted(shots_dir.glob('*.png')) if shots_dir.exists() else []

    started = meta.get('started')
    end = (run / '.done').stat().st_mtime if done else time.time()
    elapsed = int(end - started) if started else 0

    rows = []
    for flow in flows:
        steps = ''.join(
            f'<li class="step {s["status"].lower()}">{html.escape(s["label"])}</li>'
            for s in flow['steps']
        )
        reason = (
            f'<pre class="detail">{html.escape(flow["reason"][:1500])}</pre>'
            if flow['status'] == 'failed' and flow['reason']
            else ''
        )
        rows.append(
            f'''
        <section class="flow">
          <header>
            <h3>{html.escape(flow['name'])}</h3>
            {pill(flow['status'])}
            <span class="time">{flow['time']:.0f}s</span>
          </header>
          <ol class="steps">{steps}</ol>
          {reason}
        </section>'''
        )

    gallery = ''.join(
        f'<figure><img src="screenshots/{html.escape(s.name)}" loading="lazy">'
        f'<figcaption>{html.escape(s.stem)}</figcaption></figure>'
        for s in shots
    )

    environment = meta.get('environment', '')
    env_label = re.sub(r'^https?://', '', environment).split('/')[0] or 'unknown'
    build = meta.get('build', '')
    if meta.get('dirty'):
        build += ' + local changes'
    account = meta.get('account') or 'suite default'

    refresh = '' if done else '<meta http-equiv="refresh" content="5">'

    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Huppy E2E · {html.escape(meta.get('device', ''))}</title>
{refresh}
<style>
  :root {{
    color-scheme: light dark;
    --bg:#f4f1eb; --surface:#fff; --label:#141210; --muted:#6b6660;
    --line:rgba(70,66,60,.16);
  }}
  @media (prefers-color-scheme: dark) {{
    :root {{ --bg:#0d0c0b; --surface:#1a1817; --label:#f7f4f0; --muted:#a29c94;
             --line:rgba(160,154,146,.24); }}
  }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--label);
    font:15px/1.5 -apple-system,BlinkMacSystemFont,system-ui,sans-serif; }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:32px 20px 64px; }}
  h1 {{ font-size:30px; letter-spacing:.36px; margin:0 0 6px; }}
  .meta {{ display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted);
    font-size:13px; margin-bottom:18px; }}
  .meta b {{ color:var(--label); font-weight:600; }}
  .summary {{ display:flex; align-items:center; gap:12px; margin:0 0 24px; }}
  .pill {{ display:inline-block; padding:3px 11px; border-radius:999px;
    font-size:12px; font-weight:650; letter-spacing:.3px; text-transform:uppercase; }}
  .flow {{ background:var(--surface); border:1px solid var(--line);
    border-radius:18px; padding:16px 18px; margin-bottom:14px; }}
  .flow header {{ display:flex; align-items:center; gap:10px; }}
  .flow h3 {{ font-size:17px; margin:0; flex:1; }}
  .time {{ color:var(--muted); font-size:12px; }}
  .steps {{ list-style:none; margin:12px 0 0; padding:0; display:grid; gap:4px; }}
  .step {{ font-size:13px; color:var(--muted); padding-left:20px; position:relative; }}
  .step::before {{ position:absolute; left:0; }}
  .step.completed::before {{ content:'✓'; color:#1f7a45; }}
  .step.failed::before {{ content:'✗'; color:#a32218; }}
  .step.failed {{ color:#a32218; }}
  .step.running::before {{ content:'◦'; }}
  .detail {{ background:rgba(163,34,24,.08); color:#a32218; padding:10px 12px;
    border-radius:10px; font-size:12px; overflow-x:auto; margin:12px 0 0; }}
  h2 {{ font-size:13px; text-transform:uppercase; letter-spacing:.5px;
    color:var(--muted); margin:32px 0 12px; }}
  .gallery {{ display:grid; gap:16px;
    grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); }}
  figure {{ margin:0; }}
  figure img {{ width:100%; border-radius:14px; border:1px solid var(--line);
    background:var(--surface); }}
  figcaption {{ font-size:11px; color:var(--muted); margin-top:6px; text-align:center; }}
</style>
</head><body><div class="wrap">
  <h1>Huppy E2E</h1>
  <div class="meta">
    <span><b>{html.escape(meta.get('platform', 'iOS'))}</b> {html.escape(meta.get('runtime', ''))}</span>
    <span>Environment <b>{html.escape(env_label)}</b></span>
    <span>Build <b>{html.escape(build)}</b> ({html.escape(meta.get('branch', ''))})</span>
    <span>Device <b>{html.escape(meta.get('device', ''))}</b></span>
    <span>Account <b>{html.escape(account)}</b></span>
  </div>
  <div class="summary">
    {pill(overall)}
    <span class="time">{passed} passed · {failed} failed · {elapsed}s</span>
  </div>
  {''.join(rows) or '<p class="time">Waiting for the first flow…</p>'}
  {'<h2>Screenshots</h2><div class="gallery">' + gallery + '</div>' if shots else ''}
</div></body></html>"""


def main() -> int:
    run = Path(sys.argv[1]).resolve()
    (run / 'index.html').write_text(render(run))
    print(run / 'index.html')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
