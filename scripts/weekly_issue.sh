#!/usr/bin/env bash
# Runs every Monday from cron on OracleARM. Opens the weekly re-ranking
# tracking issue on Rankerage/ai-gateway-top10 (proposal only -- a human edits
# data/rankings.json and commits; see README).
set -u
REPO_DIR="/home/ubuntu/ai-gateway-top10"
PROMPT="$({ python3 "$REPO_DIR/scripts/weekly_rank.py"; } 2>/dev/null)"
WEEK="$(date +%Y-W%V)"
/usr/bin/gh issue create --repo Rankerage/ai-gateway-top10 \
  --title "Weekly AI re-ranking — ${WEEK}" \
  --body "Proposal only. A human reviews, edits data/rankings.json, runs scripts/validate.py, snapshots to data/history/, and commits.

Steps:
1. Run scripts/weekly_rank.py and score with evidence.
2. Edit data/rankings.json (totals recomputed, ranks re-sorted).
3. python3 scripts/validate.py must print OK.
4. Copy rankings.json to data/history/<date>.json, append data/history/index.json.
5. Commit + push (pre-push hook re-validates).

Scoring prompt:
\`\`\`
${PROMPT}
\`\`\`" >>/home/ubuntu/ai-gateway-top10/scripts/weekly_issue.log 2>&1
