import { useState } from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import type { Site } from '@/schemas/site';

interface Props {
  services: Site['services'];
  phone: string;
}

export default function RepairEstimator({ services, phone }: Props) {
  const [selected, setSelected] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const active = services[selected] ?? services[0];
  const fee = isEmergency ? 45 : 0;
  const min = (active?.baseMin ?? 0) + fee;
  const max = (active?.baseMax ?? 0) + fee;
  const telHref = `tel:+1${phone.replace(/\D/g, '')}`;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-paper p-6 shadow-lg sm:p-8">
      <fieldset className="mb-6">
        <legend className="text-sm font-bold text-foreground">Step 1: Select Service Issue</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {services.map((s, idx) => (
            <label
              key={s.name}
              className={`flex min-h-11 cursor-pointer flex-col justify-center rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                selected === idx ? 'border-primary bg-primary text-paper' : 'border-border bg-surface text-foreground hover:border-primary/50'
              }`}
            >
              <input type="radio" name="service" checked={selected === idx} onChange={() => setSelected(idx)} className="sr-only" />
              <span className="truncate">{s.name}</span>
              <span className="text-[11px] opacity-75">{s.duration}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="text-sm font-bold text-foreground">Step 2: Urgency</legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIsEmergency(false)}
            className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              !isEmergency ? 'border-primary bg-primary text-paper' : 'border-border bg-surface text-foreground hover:border-primary/50'
            }`}
          >
            Standard Scheduled <span className={!isEmergency ? 'text-accent' : 'text-status font-bold'}>(Save $45)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEmergency(true)}
            className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              isEmergency ? 'border-primary bg-primary text-paper' : 'border-border bg-surface text-foreground hover:border-primary/50'
            }`}
          >
            24/7 Same-Day Emergency
          </button>
        </div>
      </fieldset>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-status/10 px-3 py-1 text-xs font-bold text-status">
              <ShieldCheck size={15} aria-hidden="true" /> $0 Dispatch Fee With Repair
            </span>
            <h3 className="mt-2 text-lg font-bold">{active?.name}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-primary/70">Estimated Flat Rate</span>
            <p className="text-2xl font-extrabold text-foreground sm:text-3xl">${min} – ${max}</p>
          </div>
        </div>

        {confirmed ? (
          <div className="mt-4 rounded-lg bg-status/10 p-4 text-center text-sm font-bold text-status">
            ✓ Callback requested for {phoneInput}. A technician will contact you shortly!
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (phoneInput) setConfirmed(true); }}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="tel"
              required
              pattern="[0-9()+\\- ]{7,}"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Enter phone for callback"
              aria-label="Phone number for callback"
              className="min-h-11 flex-1 rounded-lg border border-border bg-paper px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <button type="submit" className="min-h-11 rounded-lg bg-primary px-5 text-sm font-bold text-paper transition hover:opacity-90">
              Request Callback
            </button>
            <a href={telHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-bold text-primary transition hover:opacity-90">
              <Phone size={16} aria-hidden="true" /> Call {phone}
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
