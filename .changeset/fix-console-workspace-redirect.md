---
'@object-ui/console': patch
---

fix(console): respect Vite `BASE_URL` when redirecting after a workspace
switch. The post-switch redirect previously hardcoded `/console/home`,
which broke deployments served from a different base path (e.g. Vercel,
where the console is mounted at `/`). It now derives the target from
`import.meta.env.BASE_URL`, so it works both behind `HonoServerPlugin`
(`/console/home`) and on standalone deployments (`/home`).
