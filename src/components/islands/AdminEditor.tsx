import { useState } from 'react';
import { z } from 'zod';
import { siteSchema, type Site } from '@/schemas/site';
interface Props { site: Site; onChange: (site: Site) => void; jsonDirty: boolean; onJsonDirty: (dirty: boolean) => void }
// Business details and rates, then raw JSON for everything else. Same layout as the other demo admins.
export default function AdminEditor({ site, onChange, jsonDirty, onJsonDirty }: Props) {
  const [draft, setDraft] = useState('');
  const [jsonStatus, setJsonStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const setBusiness = (patch: Partial<Site['businessInfo']>) => onChange({ ...site, businessInfo: { ...site.businessInfo, ...patch } });
  const setRate = (index: number, key: 'baseMin' | 'baseMax', value: number) => onChange({ ...site, services: site.services.map((entry, i) => i === index ? { ...entry, [key]: value } : entry) });
  const resetDraft = () => { setDraft(JSON.stringify(site, null, 2)); setJsonStatus(null); onJsonDirty(false); };
  const applyDraft = () => {
    try {
      onChange(siteSchema.parse(JSON.parse(draft)));
      onJsonDirty(false);
      setJsonStatus({ text: 'Applied. Save changes to publish.', isError: false });
    } catch (error) {
      setJsonStatus({ text: error instanceof z.ZodError ? z.prettifyError(error) : error instanceof Error ? error.message : 'Invalid JSON.', isError: true });
    }
  };
  return <>
    <section className="admin-card">
      <h2>Business details</h2>
      <div className="admin-grid">
        <label className="admin-field">Business name
          <input value={site.businessInfo.name} onChange={event => setBusiness({ name: event.target.value })} required />
        </label>
        <label className="admin-field">Phone number, like (508) 555-0194
          <input type="tel" value={site.businessInfo.phone} pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}" onChange={event => setBusiness({ phone: event.target.value })} required />
        </label>
        <label className="admin-field">Emergency surcharge (USD)
          <input type="number" min="0" value={site.copy.emergencyFee} onChange={event => onChange({ ...site, copy: { ...site.copy, emergencyFee: Number(event.target.value) } })} required />
        </label>
      </div>
      <label className="admin-check">
        <input type="checkbox" checked={site.businessInfo.emergencyAvailable} onChange={event => setBusiness({ emergencyAvailable: event.target.checked })} />
        Emergency technicians available
      </label>
    </section>
    <section className="admin-card">
      <h2>Service rates</h2>
      <div className="admin-grid">
        {site.services.map((service, index) => (
          <fieldset key={index} className="admin-group">
            <legend>{service.name}</legend>
            <label className="admin-field">Minimum (USD)
              <input type="number" min="1" value={service.baseMin} onChange={event => setRate(index, 'baseMin', Number(event.target.value))} required />
            </label>
            <label className="admin-field">Maximum (USD)
              <input type="number" min="1" value={service.baseMax} onChange={event => setRate(index, 'baseMax', Number(event.target.value))} required />
            </label>
          </fieldset>
        ))}
      </div>
    </section>
    <details className="admin-card admin-json" onToggle={event => { if ((event.target as HTMLDetailsElement).open && !jsonDirty) resetDraft(); }}>
      <summary>Edit all site content (JSON)</summary>
      <div className="admin-stack">
        <p className="admin-note">Covers page text, FAQs, areas and reviews. Apply your edits, then save changes.</p>
        <textarea rows={16} value={draft} spellCheck={false} aria-label="Site content JSON" onChange={event => { setDraft(event.target.value); onJsonDirty(true); }} />
        <div className="admin-row">
          <button type="button" onClick={applyDraft} className="admin-button">Apply JSON</button>
          <button type="button" onClick={resetDraft} className="admin-button">Reset to form values</button>
          <p role="status" className="admin-status" data-tone={jsonStatus && (jsonStatus.isError ? 'error' : 'success')}>{jsonStatus?.text}</p>
        </div>
      </div>
    </details>
  </>;
}
