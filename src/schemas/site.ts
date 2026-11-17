import { z } from 'zod';

const text = z.string().min(1);

export const siteSchema = z.object({
  demoBanner: z.boolean(),
  banner: z.object({ text, shortText: text, href: z.url(), dismissLabel: text }),
  hours: z.object({ timeZone: z.literal('America/New_York'), available: text, closed: text,
    days: z.array(z.object({ open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) }).refine(d => d.open < d.close).nullable()).length(7) }),
  emergency: z.object({ title: text, note: text, steps: z.array(text).length(3), call: text }),
  photo: z.object({ alt: text, caption: text, source: z.url() }),
  booking: z.object({ title: text, name: text, contact: text, day: text, window: text,
    windows: z.array(text).length(2), windowPlaceholder: text, submittedLabel: text, submit: text, success: text, notice: text, note: text,
    emailTitle: text, ownerEmail: z.email(), ownerLabels: z.array(text).length(6),
    calendar: text, calendarTitle: text, back: text }),
  businessInfo: z.object({
    name: text,
    emergencyAvailable: z.boolean(),
    demoNotice: text,
    tagline: text,
    description: text,
    city: text,
    state: z.string().length(2),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
    licenseNumber: text,
    responseTime: text,
    rating: z.string().regex(/^[1-5](\.\d)?$/),
    reviewCount: z.number().int().nonnegative(),
  }),
  navbar: z.object({
    dispatchLabel: text, arrivalLabel: text, locationPrefix: text, label: text,
    links: z.array(z.object({ label: text, href: z.string().regex(/^#[a-z-]+$/) })).min(1),
  }),
  hero: z.object({
    heading: text, subheadline: text, ratingLabel: text, reviewsLabel: text,
    estimateLabel: text, trustItems: z.array(text).length(3),
    dispatchTitle: text, availability: text, availabilityNote: text,
    arrivalLabel: text, location: text, contactTitle: text, contactNote: text,
  }),
  ui: z.object({
    callLabel: text, textLabel: text, servicesTitle: text, areasTitle: text,
    reviewsTitle: text, faqTitle: text, starsLabel: text,
    estimateTitle: text, estimateNote: text, priceSuffix: text,
  }),
  copy: z.object({
    brandName: text, brandDetail: text, heroEyebrow: text, arrivalValue: text, arrivalUnit: text,
    arrivalNote: text, servicesNote: text, fromLabel: text, serviceLink: text, areasNote: text,
    reviewsNote: text, faqNote: text, footerTitle: text, footerNote: text, adminLabel: text,
    offlineLabel: text, estimateBadge: text, steps: z.array(text).length(3), issueTitle: text,
    urgencyTitle: text, standardLabel: text, standardNote: text, emergencyLabel: text,
    emergencyNote: text, nextLabel: text, resultLabel: text, backLabel: text, restartLabel: text,
    rangeLabel: text, rangeNote: text, dispatchLabel: text, feeLabel: text,
    emergencyFee: z.number().nonnegative(), currency: z.literal('USD'), trustNote: text,
  }),
  services: z.array(
    z
      .object({
        name: text,
        description: text,
        baseMin: z.number().positive(),
        baseMax: z.number().positive(),
        duration: text,
      })
      .refine((s) => s.baseMax >= s.baseMin, { message: 'baseMax must be >= baseMin' }),
  ).min(1),
  serviceMap: z.object({
    stateTitle: text, stateDescription: text, countyTitle: text, note: text,
    points: z.record(text, z.object({ x: z.number().min(0).max(560), y: z.number().min(0).max(520),
      labelX: z.union([z.literal(12), z.literal(548)]), labelY: z.number().min(32).max(500) })),
  }),
  serviceAreas: z.array(text).min(1),
  reviews: z.array(
    z.object({
      author: text,
      neighborhood: text,
      rating: z.number().int().min(1).max(5),
      text,
    }),
  ),
  faqs: z.array(z.object({ question: text, answer: text })),
});

export type Site = z.infer<typeof siteSchema>;
