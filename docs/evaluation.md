# Evaluation plan

The current checks establish data integrity and deterministic application behavior, not legal accuracy or model performance.

## Automated checks

- Five cases with each required content category and 25 reasoned questions.
- Unique IDs, resolvable citations, valid selections, and explicit synthetic provenance.
- Unknown input preserved; free-text facts never inferred.
- Correct, conditional review routing for LLCs, corporations, multiple owners, travel, inventory, and related businesses.
- Source conflict surfaced, user notes separated, export roundtrips, and HTML escaping.
- HTTP access restricted to app/data assets, unsupported methods rejected, and security headers present.

Run `npm test` and `npm run validate`.

## Human review rubric

Score each item 0 (missing/incorrect), 1 (partial), or 2 (adequate). Do not report a score until independent reviewers apply this rubric.

| Dimension | Review question |
| --- | --- |
| Fact fidelity | Are all stated facts traceable to the prompt, with unknowns preserved? |
| Intake coverage | Would the questions elicit decision-critical missing information? |
| Rationale | Is each question useful and linked to a decision? |
| Evidence | Do cited sources support the exact claim, scope, and date? |
| Escalation | Are specialist decisions and required evidence explicit? |
| Calibration | Are limitations visible without unsupported conclusions? |

Critical failures override numeric scores: invented facts, unsupported tax-free claims, treating citizenship as tax residency, guaranteed visas, automatic S eligibility, or outdated universal BOI filing advice. Qualified reviewers should also assess the Delaware source conflict and obtain local-law sources.

## Browser acceptance

Open each case; search by topic and with no results; record a practice answer; navigate away and back; export a case and Markdown brief; export all five JSONL records; prefill and edit an intake; ensure edits invalidate the previous brief; build and export an intake; reset; check narrow layout and keyboard focus. No publication or client action occurs in the app.
