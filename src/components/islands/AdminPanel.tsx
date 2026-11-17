import { useState } from 'react';
import { siteSchema, type Site } from '@/schemas/site';
interface Props { endpoint: string }
export default function AdminPanel({ endpoint }: Props) {
  const [password, setPassword] = useState('');
  const [site, setSite] = useState<Site | null>(null);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  async function request(save: boolean) {
    setBusy(true); setMessage('');
    try {
      if (save && invalid) throw new Error('Correct the content JSON before saving.');
      if (save) siteSchema.parse(site);
      const response = await fetch(endpoint, { method: save ? 'PUT' : 'GET', headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' }, ...(save ? { body: JSON.stringify(site) } : {}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed. Try again.');
      if (save) setMessage(data.message); else setSite(siteSchema.parse(data));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not connect. Try again.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-panel">
    <form onSubmit={event => { event.preventDefault(); void request(Boolean(site)); }}>
      {!site ? <><label>Admin password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button className="button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></> : <>
        <label>Business name<input value={site.businessInfo.name} onChange={event => setSite({ ...site, businessInfo: { ...site.businessInfo, name: event.target.value } })} required /></label>
        <label>Phone number<input type="tel" value={site.businessInfo.phone} pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}" onChange={event => setSite({ ...site, businessInfo: { ...site.businessInfo, phone: event.target.value } })} required /></label>
        <label className="admin-toggle"><input type="checkbox" checked={site.businessInfo.emergencyAvailable} onChange={event => setSite({ ...site, businessInfo: { ...site.businessInfo, emergencyAvailable: event.target.checked } })} />Emergency technicians available</label>
        <label>Emergency surcharge<input type="number" min="0" value={site.copy.emergencyFee} onChange={event => setSite({ ...site, copy: { ...site.copy, emergencyFee: Number(event.target.value) } })} required /></label>
        <h2>Service rates</h2>
        {site.services.map((service, index) => <fieldset key={index}><legend>{service.name}</legend><div className="admin-rates">{(['baseMin', 'baseMax'] as const).map(key => <label key={key}>{key === 'baseMin' ? 'Minimum' : 'Maximum'}<input type="number" min="1" value={service[key]} required onChange={event => setSite({ ...site, services: site.services.map((entry, i) => i === index ? { ...entry, [key]: Number(event.target.value) } : entry) })} /></label>)}</div></fieldset>)}
        <details><summary onClick={() => { if (!invalid) setDraft(JSON.stringify(site, null, 2)); }}>Edit all site content</summary><p>Apply valid JSON before saving. This includes page text, FAQs, areas and reviews.</p>
          <textarea value={draft} rows={15} aria-label="Site content JSON" onChange={event => { setDraft(event.target.value); setInvalid(true); }} />
          <button type="button" className="text-link" onClick={() => { try { setSite(siteSchema.parse(JSON.parse(draft))); setInvalid(false); setMessage('Content applied. Save changes to publish.'); } catch { setInvalid(true); setMessage('Invalid content. Correct the JSON before applying it.'); } }}>Apply content</button>
        </details>
        <div className="admin-actions"><button className="button" disabled={busy || invalid}>{busy ? 'Saving…' : 'Save changes'}</button><button type="button" className="text-link" disabled={busy} onClick={() => { setSite(null); setPassword(''); setMessage(''); setInvalid(false); setDraft(''); }}>Sign out</button></div>
      </>}
    </form>
    <p role="status">{message}</p>
  </div>;
}
