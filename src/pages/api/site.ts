import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { siteSchema } from '@/schemas/site';
export const prerender = false;
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
export const ALL: APIRoute = async ({ request }) => {
  if (!['GET', 'PUT'].includes(request.method)) return reply({ error: 'Method not allowed.' }, 405);
  const password = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;
  if (!password) return reply({ error: 'Set ADMIN_PASSWORD on the server to enable editing.' }, 503);
  const expected = Buffer.from(password);
  const supplied = Buffer.from(request.headers.get('Authorization')?.replace(/^Bearer /, '') || '');
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return reply({ error: 'Incorrect password.' }, 401);
  if (request.method === 'PUT' && request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Request origin does not match.' }, 403);
  try {
    let content: unknown;
    if (request.method === 'PUT') {
      const body = await request.text();
      if (body.length > 200000) return reply({ error: 'Content is too large.' }, 413);
      const parsed = siteSchema.safeParse(JSON.parse(body));
      if (!parsed.success) return reply({ error: parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n') }, 400);
      content = parsed.data;
    }
    if (import.meta.env.DEV) {
      const { readFile, writeFile, rename } = await import('node:fs/promises');
      const path = new URL(`file://${process.cwd()}/src/data/site.json`);
      if (request.method === 'GET') return reply(siteSchema.parse(JSON.parse(await readFile(path, 'utf8'))));
      await writeFile(`${path.pathname}.tmp`, JSON.stringify(content, null, 2) + '\n');
      await rename(`${path.pathname}.tmp`, path);
      return reply({ message: 'Saved. The local site is updated.' });
    }
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo) || !token) return reply({ error: 'Configure GITHUB_REPO and GITHUB_TOKEN on the server.' }, 503);
    const url = `https://api.github.com/repos/${repo}/contents/src/data/site.json`;
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    const upstream = await fetch(url, { headers });
    if (!upstream.ok) return reply({ error: 'Could not read the site from GitHub. Check server configuration.' }, 502);
    const file = await upstream.json() as { content: string; sha: string };
    if (request.method === 'GET') return reply(siteSchema.parse(JSON.parse(Buffer.from(file.content, 'base64').toString())));
    const saved = await fetch(url, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Update site content from admin', sha: file.sha, content: Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64') }) });
    if (!saved.ok) return reply({ error: 'Could not save. Reload the latest content and try again.' }, saved.status === 409 ? 409 : 502);
    return reply({ message: 'Saved to GitHub. Changes go live after the connected deployment finishes.' });
  } catch {
    return reply({ error: 'Could not read or save the content. Check the data and server configuration.' }, 400);
  }
};
