# Site editing

Run `npm install`, copy `.env.example` to `.env`, set `ADMIN_PASSWORD`, and run `npm run dev`.
Open the displayed URL and add `/admin`. Local saves update `src/data/site.json`.

Deploy to Vercel for the admin API. Set `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`, `SITE_URL`, and `SITE_BASE` in the project environment. The GitHub token needs Contents read/write access to this repository. Connect the same repository to Vercel so commits trigger a rebuild.

Production saves commit to GitHub. The public static pages update when deployment completes. GitHub Pages can host the static demo but cannot run the admin API.

All business content is in `src/data/site.json` and validated by `src/schemas/site.ts`. Sample business claims and contact information must be replaced before using this as a live business site.

Run `npm run verify` before publishing.
