# Token-Saving Masterclass: 7 Lessons from a Developer Who Routes Everything Local

*By a developer running a local Jev routing gateway in production (ARM box, Ollama, OpenClaw/OpenCode agents). Every number below is measured, not theorized.*

## Lesson 1: Route the small stuff first — it outnumbers the big stuff 100:1

Titles, summaries, compaction, search probes, greetings, status checks. Each is tiny, but there are hundreds per session. Pin them to the cheapest tier (`small_model = jev/auto`, title/summary/compaction agents on a 2B local model). Measured: a single routed trivial call cost 41 prompt + 5 completion tokens, all local and free; the routing decision itself was ~460 tokens. One decision buys thousands of saved tokens.

## Lesson 2: Orchestrate in lanes, not in models

Don't pick models — pick *lanes*: `fast` (trivial, no tools), `standard` (ordinary work with tools), `deep` (costly mistakes). Escalate exactly one lane at a time and only on evidence (failing tests, scope breach). A hunch is not evidence. Three named subagents beat thirty model IDs.

## Lesson 3: Cache before you route

Routing picks a cheaper price per token. Caching deletes tokens entirely. Order of operations: exact-match cache → semantic cache → route → compact. A cache hit costs nothing; the cheapest model still costs something.

## Lesson 4: The gateway cannot shrink your context — you must

A proxy sees a finished request body. It cannot know that 6,000 tokens are tool schemas you never call. Reduce declared tools, stop re-sending history, cap reasoning effort. Measured in the literature: up to 75% of agentic session cost is repeated input — fix the client, then the gateway.

## Lesson 5: Audit input vs output before buying anything

Two numbers decide your strategy: share of spend on input vs output. Input-heavy (>80%) → caching + context discipline. Output-heavy (>40%) → fewer turns, shorter reasoning chains. No cache on any planet discounts output tokens.

## Lesson 6: Fail open, always

Every routing call gets a 2.5-second budget. Gateway down, slow, or unsure → stay on the current model and say so. A router that breaks the request is worse than no router. Log decisions without prompt text; review the log weekly and move models between pools.

## Lesson 7: Measure for a week, then tune — never the reverse

Run routing in shadow mode (decide + log, don't switch) for a week. Read which tier real traffic lands in. Then reorder pools, adjust thresholds from your own traces, and only then switch on. Our log: 75 decisions, 61% success, failures traced to one oversized tier (4B model on 4 ARM cores timing out at 480s) — fixed by dropping `standard` to 1.7B.
