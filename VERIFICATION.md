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

Custom booking controls were checked in the production preview at 320, 375, 768 and 1440px. The calendar has 44px day targets, arrow and month navigation, disabled past dates, and focus restoration after selection or Escape. The time dropdown supports typing, arrows, Home/End, Enter, Tab, Escape and outside-click dismissal. Availability refreshes on form interaction; noon and 4 pm cutoffs still pass.

Automated axe scans found no WCAG A/AA violations with the calendar or dropdown open. Keyboard checks confirm the shared 2px outline and white separation on call buttons, navigation, form actions and FAQ summaries. No browser or network errors occurred. Browser assertions are in `/tmp/baystate-pickers-check.cjs`; screenshots are `/tmp/baystate-calendar-375.png` and `/tmp/baystate-dropdown-375.png`. Checked in Chromium; manual screen-reader and Safari testing remain unperformed.
