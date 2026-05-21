import { z } from 'zod';

export const phoneRegex = /^[+0-9\s()-]{7,20}$/;

export const baseLeadSchema = z.object({
  name: z.string().trim().min(2, 'الاسم قصير جدًا').max(80),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'رقم الهاتف غير صالح'),
  city: z.string().trim().min(2, 'المدينة مطلوبة').max(60),
  company_type: z.string().trim().min(2, 'نوع الشركة مطلوب').max(60),
  consent: z
    .boolean()
    .refine((v) => v === true, 'يجب الموافقة على الشروط')
});

export const calculatorLeadSchema = baseLeadSchema;

export const arsenalLeadSchema = baseLeadSchema;

export const bookingSchema = baseLeadSchema.extend({
  selected_package: z.string().trim().min(1, 'الباقة المختارة مطلوبة'),
  company_size: z.string().trim().min(1, 'حجم الشركة مطلوب'),
  message: z.string().trim().max(2000).optional().or(z.literal(''))
});

export const finalLeadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(phoneRegex, 'رقم الهاتف غير صالح'),
  consent: z
    .boolean()
    .refine((v) => v === true, 'يجب الموافقة على الشروط')
});

export type CalculatorLead = z.infer<typeof calculatorLeadSchema>;
export type BookingLead = z.infer<typeof bookingSchema>;
export type ArsenalLead = z.infer<typeof arsenalLeadSchema>;
export type FinalLead = z.infer<typeof finalLeadSchema>;
