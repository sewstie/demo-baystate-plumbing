# BayState demo checks

2026-11-17, production static preview at 375px.

`GITHUB_ACTIONS=true npm run verify` passes. `npm test` covers business hours, daylight saving time, contact validation, invalid dates and calendar output.

Browser checks pass at 320, 375, 768 and 1440px without horizontal overflow. Tested mobile popover, no-hash navigation, service preselection before island hydration, result focus, request preview and calendar download. No requests are sent by the demo booking form.

Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 66. LCP 1.7s. CLS 0. SEO is reduced by the intentional noindex directive. These are local lab measurements, not field data.

Black text on emergency orange has 8.79:1 contrast. Hero WebP variants are 14, 27, 44 and 74 KB. Both fonts are local WOFF2 files with matching preload URLs. The social image is 1200×630.

GitHub Pages target: https://sewstie.github.io/demo-baystate-plumbing/
The configured target currently returns 404. Publishing is still required. GitHub Pages cannot run the admin API; the public admin link is removed.

The technician photograph is stock imagery, not a verified employee portrait. See SOURCES.md.
