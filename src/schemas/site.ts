import { z } from 'zod';

const text = z.string().min(1);

export const siteSchema = z.object({
  businessInfo: z.object({
    name: text,
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
  ),
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
