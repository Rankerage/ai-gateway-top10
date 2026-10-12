#!/usr/bin/env python3
"""Weekly AI re-ranking proposal (proposal only -- a human must approve).

Usage:
  python3 scripts/weekly_rank.py [--week YYYY-WNN]

What it does:
  1. Loads data/criteria.json (dimensions + weights + rules).
  2. Loads data/rankings.json (current scores).
  3. Prints an AI prompt that asks for re-scored 0-10 dimensions with
     one-line evidence per change, plus the exact JSON patch to apply.
  4. DOES NOT write anything. The human pastes the AI answer back,
     edits data/rankings.json, runs scripts/validate.py, snapshots to
     data/history/, and commits.

The Monday GitHub Action opens a tracking issue with this prompt attached.
"""
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    week = sys.argv[sys.argv.index("--week") + 1] if "--week" in sys.argv else date.today().strftime("%Y-W%V")
    criteria = json.loads((ROOT / "data" / "criteria.json").read_text())
    current = json.loads((ROOT / "data" / "rankings.json").read_text())
    dims = "\n".join(f"- {k} (x{w['weight']}): {w['description']}" for k, w in criteria["dimensions"].items())
    table = "\n".join(
        f"- #{g['rank']} {g['name']}: " + ", ".join(f"{k}={v}" for k, v in g["scores"].items())
        for g in current["rankings"]
    )
    print(f"""# Weekly AI re-ranking -- {week}

You are ranking AI gateways for developers through one lens: TOKEN SAVING.
Score dimensions (weights sum to 100):
{dims}

Rules:
{chr(10).join('- ' + r for r in criteria['rules'])}

Current scores:
{table}

Task:
1. Check each gateway for changes since last week (pricing, features, outages, acquisitions).
2. Propose 0-10 scores per dimension. Keep a score unless you have evidence to move it.
3. For every changed score, give ONE line of evidence with a source URL.
4. Output the full updated rankings.json `rankings` array only (same schema, re-ranked, totals recomputed).

Do not invent prices or features. Unverifiable = keep last week.
""")


if __name__ == "__main__":
    main()
