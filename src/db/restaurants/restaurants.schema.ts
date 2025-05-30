import z from 'zod';

export const restaurantSchema = z.object({
  name: z.string().describe('Name of the restaurant'),
  latitude: z
    .number()
    .describe('Latitude coordinate of the restaurant location'),
  longitude: z
    .number()
    .describe('Longitude coordinate of the restaurant location'),
  image_url: z.string().url(),
  description: z.string().optional().describe('Description of the restaurant'),
  address: z.string().describe('Physical address of the restaurant'),
  //   phone: z
  //     .string()
  //     .optional()
  //     .describe('Contact phone number of the restaurant'),
  //   website: z
  //     .string()
  //     .url()
  //     .optional()
  //     .describe('Website URL of the restaurant'),
  cuisine_type: z
    .string()
    .describe('Type of cuisine offered by the restaurant'),
  price_range: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe('Price range of the restaurant, from 1 to 5'),
  rating: z
    .number()
    .min(0)
    .max(5)
    .describe('Average rating of the restaurant, from 0 to 5'),
  open_hours: z.string().optional().describe('Opening hours of the restaurant'),
  created_at: z.date().describe('Timestamp when the restaurant was created'),
  updated_at: z
    .date()
    .optional()
    .describe('Timestamp when the restaurant was last updated'),
});
