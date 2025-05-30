import z from 'zod';

export const paginationSchema = z.object({
  limit: z
    .number()
    .int()
    .min(1)
    .default(10)
    .describe('Number of items to return'),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('Number of items to skip for pagination'),
});
