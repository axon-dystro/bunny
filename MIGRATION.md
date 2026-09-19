# Bunny migration

Source: /home/axon/Bunny/bunny at bc8b2f24dbf4af41432432828807bc8129f91469.
Snapshot: /srv/chatgpt/staging/bunny-import-XRYJGaQO/source.
Migration branch: chatgpt-dev. GitHub main has three newer UI/cache commits, intentionally not merged into the live-code migration baseline.

Runtime state is separate from Git: /srv/chatgpt/projects/bunny/data/dev/data.json, mounted by systemd at /srv/chatgpt/sandbox/data/data.json. BUNNY_DATA_FILE can override the path for isolated tests. Missing or invalid state aborts startup instead of resetting counters. Local execution defaults to data/data.json and requires an explicitly seeded state file.

Use project_exec with an explicit fetch and fast-forward of chatgpt-dev for updates. The existing generic repo_pull action hardcodes dev and must not be used for this migration branch. Only source files should be staged.

The old PM2 instance and live domains stay active until manual comparison and final state synchronization. Dev changes must not be synced back to live counters. Pookie editing remains hostname-based as in the original application; this is not user authentication.
