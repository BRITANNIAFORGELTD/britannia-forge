import { z } from 'zod';

export const step1Schema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  occupants: z.string().min(1, 'Number of occupants is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  currentBoiler: z.string().min(1, 'Current boiler type is required'),
  flueLocation: z.string().min(1, 'Flue location is required'),
  flueExtension: z.string().min(1, 'Flue extension is required'),
  drainNearby: z.boolean(),
  moveBoiler: z.boolean(),
  parkingSituation: z.string().min(1, 'Parking situation is required'),
  parkingDistance: z.string().min(1, 'Parking distance is required'),
});

export const step2Schema = z.object({
  photos: z.array(z.string()).optional(),
});

export const step3Schema = z.object({
  selectedPackage: z.string().min(1, 'Please select a package'),
  thermostatUpgrade: z.string().optional(),
});

export const step4Schema = z.object({
  customerDetails: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    preferredDate: z.string().min(1, 'Preferred date is required'),
  }),
});

export const step5Schema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
});

export function validateStep(step: number, data: any) {
  switch (step) {
    case 1:
      return step1Schema.parse(data);
    case 2:
      return step2Schema.parse(data);
    case 3:
      return step3Schema.parse(data);
    case 4:
      return step4Schema.parse(data);
    case 5:
      return step5Schema.parse(data);
    default:
      return data;
  }
}
