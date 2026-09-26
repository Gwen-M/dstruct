# Firstbase / Delaware founder intake PoC

A small, dependency-free local web application exploring how to turn a non-US founder's incorporation request into an evidence-linked intake and a specialist handoff. Firstbase is a working project name, with no affiliation to any incorporation provider.

## Run

Requires Node.js 22 or newer. No API key or package installation.

```sh
npm start
# http://127.0.0.1:4173
npm test
npm run validate
```

Five manually authored synthetic cases cover a solo remote consultant, a venture-backed software team, an ecommerce seller, cross-border cofounders, and a relocating founder. Each includes the original fictional prompt, provided facts, missing information, proposed questions and rationales, sourced concerns, and specialist decisions.

Browse cases, record practice answers, try structured intake, inspect the source register, and export JSON, JSONL, or Markdown. Everything runs locally. Draft answers live in browser memory and disappear on reload. Downloads may contain anything you typed. The app does not send intake text to an AI service.

The cases are invented, not deidentified client records. They are illustrative archetypes, not evidence of market frequency. Questions are proposed, not transcripts of actual conversations. Rules are transparent and deterministic; free text is preserved, not automatically interpreted. No legal conclusions, entity election, tax calculation, immigration eligibility, or filings are automated.

Sources were checked on 2026-09-26. This is a dated research snapshot requiring specialist review before real use. See [methodology](docs/methodology.md), [evaluation](docs/evaluation.md), and [source notes](docs/source-notes.md).
