import { useState } from 'react';
import { z } from 'zod';
import { siteSchema, type Site } from '@/schemas/site';
import AdminEditor from './AdminEditor';
interface Props { endpoint: string }
// Stable ref callback: focuses the editor heading once, when sign-in replaces the form.
const focusOnMount = (element: HTMLElement | null) => element?.focus();
export default function AdminPanel({ endpoint }: Props) {
  const [password, setPassword] = useState('');
  const [site, setSite] = useState<Site | null>(null);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [jsonDirty, setJsonDirty] = useState(false);
  async function request(save: boolean) {
    if (save && jsonDirty) return setStatus({ text: 'Apply or reset your JSON edits before saving.', isError: true });
    setBusy(true); setStatus(null);
    try {
      if (save) siteSchema.parse(site);
      const response = await fetch(endpoint, { method: save ? 'PUT' : 'GET', headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' }, ...(save ? { body: JSON.stringify(site) } : {}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed. Try again.');
      if (save) setStatus({ text: data.message, isError: false });
      else {
        setSite(siteSchema.parse(data));
        if (site) setStatus({ text: 'Latest saved content loaded.', isError: false });
      }
    } catch (error) { setStatus({ text: error instanceof z.ZodError ? z.prettifyError(error) : error instanceof Error ? error.message : 'Could not connect. Try again.', isError: true }); }
    finally { setBusy(false); }
  }
  const statusLine = <p role="status" className="admin-status" data-tone={status && (status.isError ? 'error' : 'success')}>{status?.text}</p>;
  if (!site) return (
    <form className="admin-card admin-login" onSubmit={event => { event.preventDefault(); void request(false); }}>
      <h1>Sign in</h1>
      <p className="admin-note">The password stays in this tab's memory and is never stored in the browser.</p>
      <label className="admin-field">Admin password
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required />
      </label>
      <div className="admin-row">
        <button type="submit" disabled={busy} className="admin-button admin-button-primary">{busy ? 'Signing in…' : 'Sign in'}</button>
        {statusLine}
      </div>
    </form>
  );
  return (
    <form className="admin-editor" onSubmit={event => { event.preventDefault(); void request(true); }}>
      <div className="admin-head">
        <h1 tabIndex={-1} ref={focusOnMount}>Site settings</h1>
        <p className="admin-note">Edit the details below, then save. The live site updates after it rebuilds.</p>
      </div>
      <fieldset disabled={busy} className="admin-sections">
        <AdminEditor site={site} onChange={setSite} jsonDirty={jsonDirty} onJsonDirty={setJsonDirty} />
      </fieldset>
      <div className="admin-actions">
        {statusLine}
        <button type="button" onClick={() => void request(false)} disabled={busy} className="admin-button">Reload</button>
        <button type="button" onClick={() => { setSite(null); setPassword(''); setStatus(null); setJsonDirty(false); }} disabled={busy} className="admin-button">Sign out</button>
        <button type="submit" disabled={busy} className="admin-button admin-button-primary">{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </form>
  );
}
