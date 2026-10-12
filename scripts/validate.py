#!/usr/bin/env python3
"""Validate data/rankings.json against the ranking schema. Exit 1 on error."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIMS = {"tokenSaving": 30, "reliability": 20, "coverage": 15, "devEx": 15, "governance": 10, "priceTransparency": 10}
REQ = {"rank", "name", "url", "tagline", "best_for", "pricing", "self_host", "pros", "cons", "token_saving", "scores", "total"}


def fail(msg: str) -> None:
    print(f"ERROR: {msg}")
    sys.exit(1)


def main() -> None:
    d = json.loads((ROOT / "data" / "rankings.json").read_text())
    if set(DIMS) != set(d.get("weights", {})) or sum(d["weights"].values()) != 100:
        fail("weights must match criteria dimensions and sum to 100")
    ranks = [g["rank"] for g in d["rankings"]]
    if sorted(ranks) != list(range(1, len(ranks) + 1)):
        fail(f"ranks must be 1..{len(ranks)} exactly once, got {sorted(ranks)}")
    for g in d["rankings"]:
        if missing := REQ - set(g):
            fail(f"#{g.get('rank')} {g.get('name')}: missing {sorted(missing)}")
        if set(g["scores"]) != set(DIMS):
            fail(f"{g['name']}: scores must cover all dimensions")
        if any(not isinstance(v, (int, float)) or v < 0 or v > 10 for v in g["scores"].values()):
            fail(f"{g['name']}: scores must be 0-10")
        expect = round(sum(g["scores"][k] * w / 100 for k, w in DIMS.items()), 2)
        if abs(g["total"] - expect) > 0.01:
            fail(f"{g['name']}: total {g['total']} != weighted {expect}")
    print(f"OK: {len(d['rankings'])} gateways, week {d.get('week')}, weights sum 100.")


if __name__ == "__main__":
    main()
