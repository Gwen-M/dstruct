# GitHub publishing

Target: https://github.com/Gwen-M/dstruct

Authentication uses the user's existing GitHub SSH configuration. No private key or token is copied into this repository.

After creating an empty private repository named `dstruct` under `Gwen-M`:

```sh
git remote add origin git@github.com:Gwen-M/dstruct.git
node scripts/publish-history.mjs
```

If origin is already configured, skip the first command. The script requires a clean `main` branch and the exact expected remote. It pushes each pending commit separately, verifies each remote head, and records the successful pushes in `.local/push-log.jsonl` (ignored by Git). It stops on failure or divergent remote history and never force-pushes. Re-running resumes from the current remote commit.

The development history has at least 25 substantive commits. Publishing to an empty remote through this script creates at least 25 separate pushes. Commits already on GitHub are not pushed again just to inflate the count. Local log entries are receipts from this script, not a permanent GitHub audit log.
