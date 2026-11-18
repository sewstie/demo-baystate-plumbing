# BayState demo checks

2026-11-18, production static preview at `http://127.0.0.1:4322/demo-baystate-plumbing/`, 375px wide.

`npm run verify` and `GITHUB_ACTIONS=true npm run verify` pass. `npm test` covers business hours, daylight saving time, contact validation, invalid dates, noon and 4 pm window cutoffs, midnight/year rollover, friendly errors and calendar output.

Chromium checks pass at 375px for service preselection, installation pricing, first-invalid-field focus, expired time windows, tomorrow's minimum date after 4 pm, confirmation order and visibility, readable dates, submission time and calendar download. The mobile header hides on downward scroll and returns on upward scroll. Reduced motion and desktop keep it visible. The call dock stays visible. No requests are sent by the demo booking form.

Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 66. LCP 1.8s. CLS 0. Total blocking time 0ms. SEO is reduced by the intentional noindex directive. These are local lab measurements, not field data.

Both fonts return HTTP 200 under `/demo-baystate-plumbing/_astro/`. Their preload URLs exactly match the compiled `@font-face` URLs. Chromium's rendered-font inspection confirms `Barlow Condensed` supplies the h1 glyphs. No observed requests returned 404 or another error status; no browser runtime errors occurred.

Local artifacts: `/tmp/baystate-fixes-lighthouse.report.html`, `/tmp/baystate-fixes-lighthouse.report.json`, `/tmp/baystate-confirmation-375.png`. Browser assertions are in `/tmp/baystate-fixes-check.cjs`.

GitHub Pages target: https://sewstie.github.io/demo-baystate-plumbing/
The live target was not checked or deployed in this pass. GitHub Pages cannot run the admin API; the public admin link is removed.

The technician photograph is stock imagery, not a verified employee portrait. See SOURCES.md.
