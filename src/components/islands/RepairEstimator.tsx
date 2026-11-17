import { useEffect, useState } from 'react';
import RequestTime from './RequestTime';
import { ArrowRight, ArrowLeft, Check, Phone } from 'lucide-react';
import type { Site } from '@/schemas/site';
interface Props { services: Site['services']; phone: string; booking: Site['booking']; copy: Site['copy'] }
export default function RepairEstimator({ services, phone, booking, copy: c }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const select = (event?: Event) => {
      const value = event instanceof CustomEvent ? event.detail : Number(document.getElementById('estimate')?.dataset.service ?? 0);
      if (Number.isInteger(value) && value >= 0 && value < services.length) { setSelected(value); setStep(0); }
    };
    select(); document.addEventListener('select-service', select);
    return () => document.removeEventListener('select-service', select);
  }, [services.length]);
  const [emergency, setEmergency] = useState(false);
  const active = services[selected];
  const fee = emergency ? c.emergencyFee : 0;
  const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(amount);
  if (step === 3) return <div className="estimator estimate-body"><RequestTime content={booking} service={active.name} range={`${money(active.baseMin)} – ${money(active.baseMax)}`} onBack={() => setStep(2)} /></div>;
  return <div className="estimator">
    <ol className="estimate-steps">{c.steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={step >= index ? 'active' : ''}><span>{step > index ? <Check size={14} aria-hidden="true" /> : index + 1}</span>{label}</li>)}</ol>
    <div className="estimate-body" aria-live="polite">
      {step === 0 && <fieldset><legend>{c.issueTitle}</legend><div className="issue-options">{services.map((service, index) => <label className={selected === index ? 'selected' : ''} key={service.name}><input type="radio" name="service" value={index} checked={selected === index} onChange={() => setSelected(index)} /><span>{service.name}</span></label>)}</div></fieldset>}
      {step === 1 && <fieldset><legend>{c.urgencyTitle}</legend><div className="urgency-options">{[false, true].map(value => <label className={emergency === value ? 'selected' : ''} key={String(value)}><input type="radio" name="urgency" checked={emergency === value} onChange={() => setEmergency(value)} /><span><strong>{value ? c.emergencyLabel : c.standardLabel}</strong><small>{value ? c.emergencyNote : c.standardNote}</small>{value && <small>{c.feeLabel}: {money(c.emergencyFee)}</small>}</span></label>)}</div></fieldset>}
      {step === 2 && <div className="estimate-result"><p>{c.rangeLabel}</p><h3 tabIndex={-1} ref={node => node?.focus({ preventScroll: true })}>{active.name}</h3><strong className="price-range">{money(active.baseMin + fee)} – {money(active.baseMax + fee)}</strong><p>{emergency ? c.emergencyLabel : c.standardLabel}</p><p className="estimate-disclaimer">{c.rangeNote}</p>{emergency ? <a className="button emergency-button" href={`tel:+1${phone.replace(/\D/g, '')}`}><Phone size={17} aria-hidden="true" />{c.dispatchLabel}</a> : <button className="button" onClick={() => setStep(3)}>{booking.title}</button>}</div>}
      <div className="estimate-controls">{step > 0 && <button className="text-link" onClick={() => setStep(step - 1)}><ArrowLeft size={16} aria-hidden="true" />{c.backLabel}</button>}{step < 2 ? <button className="button" onClick={() => setStep(step + 1)}>{step === 0 ? c.nextLabel : c.resultLabel}<ArrowRight size={17} aria-hidden="true" /></button> : <button className="text-link" onClick={() => { setStep(0); setSelected(0); setEmergency(false); }}>{c.restartLabel}</button>}</div>
    </div>
  </div>;
}
