# Top 10 AI Gateways for Developers — Ranked Weekly by AI

One ranking, one lens: **how much of your token bill survives.** Scores recomputed every Monday against open criteria (`data/criteria.json`) — and every line stays human-editable.

🌐 **Site:** https://rankerage.github.io/ai-gateway-top10/

## Edit the ranking (humans welcome)

1. Edit `data/rankings.json` — one object per gateway: scores, pros, cons, pricing.
2. Run `python3 scripts/validate.py` (also enforced automatically on every push).
3. Snapshot: copy to `data/history/YYYY-MM-DD.json`, append to `data/history/index.json`.
4. Commit / PR. Human override always wins.

## Weekly AI re-ranking

- `python3 scripts/weekly_rank.py` prints the scoring prompt (proposal only — never auto-merges).
- Every Monday 09:00 KST, a tracking issue opens automatically with that prompt.
- Rules live in `data/criteria.json`: weights (token saving ×30), evidence-per-change, no sponsored placements.
- Automation runs from the maintainer's server (cron + push guard), so no extra setup is needed.

## Layout

| Path | What |
|---|---|
| `index.html` / `styles.css` / `app.js` | Responsive site (table on desktop, cards on mobile), data-driven |
| `data/rankings.json` | Source of truth |
| `data/criteria.json` | Scoring dimensions + weights + rules |
| `data/history/` | Weekly snapshots + index |
| `lecture/token-saving-masterclass.md` | 7 token-saving lessons from a production local-routing setup |
| `scripts/` | `weekly_rank.py` (prompt), `validate.py` (push guard), `weekly_issue.sh` (Monday issue) |

MIT licensed. Prices change — verify before you ship.
