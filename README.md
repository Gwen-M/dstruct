# Dstruct / Delaware founder intake PoC

A small, dependency-free local web application exploring how to turn a non-US founder's incorporation request into an evidence-linked intake and a specialist handoff.

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

Repository: [Gwen-M/dstruct](https://github.com/Gwen-M/dstruct). See [publishing instructions](docs/publishing.md) for the resumable script that publishes each development commit in a separate, verified SSH push.

## Web3 product vision

Open **http://127.0.0.1:4173/pitch/** after `npm start` for a 2:16 animated presentation with English subtitles, chapter navigation, scrubbing, fullscreen, and an accessible transcript. It starts paused and has no audio. The fictional scenario explores incorporation, treasury context, and adviser coordination for web3 founders.

The animation labels future capabilities as a product vision. The current prototype remains a deterministic intake and casebook; AI conversations, wallet integration, document permissions, and task collaboration are proposed experiences.

A ready-to-use silent MP4 and SRT are included in `pitch/` and linked from the player.

The editable presentation source lives in `pitch/`. An optional exporter, `scripts/render-pitch.mjs`, renders the same scenes to H.264 MP4 and SRT using `@napi-rs/canvas` and FFmpeg. Set `CANVAS_MODULE` to the canvas module path and `FFMPEG` to the encoder binary, then run `node scripts/render-pitch.mjs`. These export tools are not runtime dependencies. Static builds include the browser presentation via `node scripts/build-static.mjs`.
