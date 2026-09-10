#!/usr/bin/env python3
"""Record what a run was: the device, the build, and the backend behind it.

The report's header row is built from this, so a saved run still says what it
was testing months later.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import time


def sh(command: str, default: str = '') -> str:
    try:
        return subprocess.check_output(
            command, shell=True, text=True, stderr=subprocess.DEVNULL
        ).strip()
    except Exception:
        return default


def runtime_for(udid: str) -> str:
    """The iOS version the device runs, from the runtime it belongs to."""
    listing = sh('xcrun simctl list devices -j')
    if not listing:
        return ''
    try:
        devices = json.loads(listing)['devices']
    except (ValueError, KeyError):
        return ''
    for runtime, entries in devices.items():
        if any(entry.get('udid') == udid for entry in entries):
            version = runtime.rsplit('.', 1)[-1]
            return re.sub(r'^iOS-', 'iOS ', version).replace('-', '.')
    return ''


def main() -> int:
    out, device, udid, email = sys.argv[1:5]

    json.dump(
        {
            'started': time.time(),
            'platform': 'iOS',
            'runtime': runtime_for(udid),
            'device': device,
            'udid': udid,
            'environment': sh(
                'grep -m1 EXPO_PUBLIC_GRAPHQL_ENDPOINT .env | cut -d= -f2-', 'unknown'
            ),
            'build': sh('git rev-parse --short HEAD', 'working tree'),
            'branch': sh('git rev-parse --abbrev-ref HEAD'),
            'dirty': bool(sh('git status --porcelain')),
            'account': email,
        },
        open(out, 'w'),
        indent=2,
    )
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
