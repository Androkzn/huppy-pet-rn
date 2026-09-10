#!/usr/bin/env bash
#
# Runs the Maestro suite one flow at a time.
#
# Maestro's directory runner drives every flow against the same simulator at
# once, and its XCUITest driver does not survive that — flows die with
# "Device became unreachable" rather than a real assertion failure. Running the
# flows in sequence keeps one driver alive per flow, and a failed flow is
# retried once before it is called a failure, so a driver hiccup does not read
# as a broken app.
#
# The run is watchable while it happens: the simulator window is opened, and an
# HTML report is written beside the logs, opened in the browser, and regenerated
# after every flow. Runs are kept so one can be compared against the last;
# `latest` points at the newest.
#
# Usage: scripts/e2e.sh [device-name] [flow-name-filter]

set -uo pipefail

DEVICE_NAME="${1:-${E2E_DEVICE:-Huppy-A}}"
APP_ID="${E2E_BUNDLE_ID:-com.huppy.pet}"
FILTER="${2:-}"

# Maestro reads .maestro/config.yaml only for a whole-directory run; these flows
# are run one file at a time, so the same values are passed on the command line.
E2E_EMAIL="${E2E_EMAIL:-maestro-e2e@huppy.test}"
E2E_PASSWORD="${E2E_PASSWORD:-Huppy!e2e2026}"
PET_NAME="${PET_NAME:-Maestro}"
FLOW_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.maestro"
RESULTS_DIR="${E2E_RESULTS_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.maestro-results}"
RUN_DIR="$RESULTS_DIR/$(date +%Y-%m-%d_%H%M%S)"

mkdir -p "$RUN_DIR"
ln -sfn "$RUN_DIR" "$RESULTS_DIR/latest"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
render() {
  python3 "$ROOT_DIR/scripts/e2e/render-report.py" "$RUN_DIR" >/dev/null 2>&1 || true
}

DEVICE_ID=$(xcrun simctl list devices available \
  | grep -F "$DEVICE_NAME (" \
  | head -1 \
  | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')

if [ -z "$DEVICE_ID" ]; then
  echo "Creating simulator $DEVICE_NAME"
  RUNTIME=$(xcrun simctl list runtimes | grep -E '^iOS' | tail -1 | sed -E 's/.*(com\.apple\.CoreSimulator\.SimRuntime\.[^ ]+).*/\1/')
  DEVICE_TYPE=$(xcrun simctl list devicetypes | grep -E 'iPhone 1[6-9]( |\()' | tail -1 | sed -E 's/.*\((com\.apple\.CoreSimulator\.SimDeviceType\.[^)]+)\).*/\1/')
  DEVICE_ID=$(xcrun simctl create "$DEVICE_NAME" "$DEVICE_TYPE" "$RUNTIME")
fi

# A simulator only grows: every run leaves app bundles, data, logs and crash
# reports behind, and a device reaches gigabytes within weeks. Erasing keeps the
# device identity — and so every reference to it by name — while dropping what
# accumulated. Only the device this run is about to use, only when it is over
# the cap, and never while another build or suite is in flight.
DEVICE_CAP_MB="${E2E_DEVICE_CAP_MB:-2500}"
DEVICE_DIR="$HOME/Library/Developer/CoreSimulator/Devices/$DEVICE_ID"
if [ -d "$DEVICE_DIR" ]; then
  SIZE_MB=$(du -sm "$DEVICE_DIR" 2>/dev/null | cut -f1)
  if [ "${SIZE_MB:-0}" -gt "$DEVICE_CAP_MB" ]; then
    # Match the driver and build processes themselves, not any command line
    # that merely mentions maestro — this script's own report rendering passes
    # a path under .maestro-results, and a loose pattern matched that, so the
    # device was never erased and grew until the disk was full.
    if pgrep -f 'xcodebuild|maestro\.cli\.AppKt|maestro-driver-ios' >/dev/null 2>&1; then
      echo "Device is ${SIZE_MB} MB (cap ${DEVICE_CAP_MB}); a build or suite is running, leaving it alone"
    else
      echo "Device is ${SIZE_MB} MB (cap ${DEVICE_CAP_MB}); erasing"
      xcrun simctl shutdown "$DEVICE_ID" >/dev/null 2>&1 || true
      xcrun simctl erase "$DEVICE_ID"
    fi
  fi
fi

xcrun simctl bootstatus "$DEVICE_ID" -b >/dev/null 2>&1 || xcrun simctl boot "$DEVICE_ID" >/dev/null 2>&1
open -a Simulator >/dev/null 2>&1 || true

# Run metadata for the report header: what was tested, where, and against what.
python3 "$ROOT_DIR/scripts/e2e/run-metadata.py" \
  "$RUN_DIR/run.json" "$DEVICE_NAME" "$DEVICE_ID" "${E2E_EMAIL:-}"

render
open "$RUN_DIR/index.html" >/dev/null 2>&1 || true

# The suite drives an installed app; an erased or fresh device has none, so it
# is built once rather than failing every flow with "app not installed".
if ! xcrun simctl get_app_container "$DEVICE_ID" "$APP_ID" >/dev/null 2>&1; then
  echo "$APP_ID is not installed on $DEVICE_NAME — building it"
  npx expo run:ios --device "$DEVICE_NAME" --no-bundler
fi

echo "Device : $DEVICE_NAME ($DEVICE_ID)"
echo "Results: $RUN_DIR"
echo "Report : $RUN_DIR/index.html"
echo

passed=0
failed=0
failed_flows=()

for flow in "$FLOW_DIR"/*.yaml; do
  name=$(basename "$flow" .yaml)
  [ "$name" = "config" ] && continue
  if [ -n "$FILTER" ] && [[ "$name" != *"$FILTER"* ]]; then continue; fi

  log="$RUN_DIR/$name.log"
  printf '%-22s ' "$name"

  started=$(date +%s)
  for attempt in 1 2 3; do
    maestro --device "$DEVICE_ID" test \
      --debug-output "$RUN_DIR/debug/$name" \
      -e E2E_EMAIL="$E2E_EMAIL" \
      -e E2E_PASSWORD="$E2E_PASSWORD" \
      -e PET_NAME="$PET_NAME" \
      "$flow" >"$log" 2>&1
    status=$?
    [ $status -eq 0 ] && break

    # Tell a test result from an environment failure. A flow that reached an
    # assertion and failed it reports FAILED; one whose driver died reports
    # nothing of the sort, and that is worth another attempt rather than a
    # verdict on the app. The driver is starved of CPU when several suites
    # share this machine, so the wait grows with each attempt.
    if grep -qE "FAILED|Assertion is false" "$log"; then
      break
    fi
    printf 'retry '
    sleep $((attempt * 15))
  done

  elapsed=$(( $(date +%s) - started ))
  if [ $status -eq 0 ]; then
    echo "PASS"
    passed=$((passed + 1))
    printf '%s\t%s\t%s\n' "$name" "passed" "$elapsed" >>"$RUN_DIR/results.tsv"
  else
    echo "FAIL  -> $log"
    failed=$((failed + 1))
    failed_flows+=("$name")
    printf '%s\t%s\t%s\n' "$name" "failed" "$elapsed" >>"$RUN_DIR/results.tsv"
  fi

  # Screenshots land in the flow's debug output; gather them for the report.
  mkdir -p "$RUN_DIR/screenshots"
  find "$RUN_DIR/debug/$name" -name '*.png' \
    -exec cp -f {} "$RUN_DIR/screenshots/" \; 2>/dev/null || true
  # The rest of that output is a screenshot per command — worth keeping only
  # where a flow failed and someone has to look at what it did.
  [ $status -eq 0 ] && rm -rf "$RUN_DIR/debug/$name"
  render
done

touch "$RUN_DIR/.done"
render

# Runs are kept for comparison, but not forever.
ls -td "$RESULTS_DIR"/*/ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

echo
echo "Passed: $passed   Failed: $failed"
echo "Report: $RUN_DIR/index.html"
if [ ${#failed_flows[@]} -gt 0 ]; then
  printf 'Failed flows: %s\n' "${failed_flows[*]}"
  exit 1
fi
