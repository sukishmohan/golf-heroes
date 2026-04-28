import { z } from 'zod'

export const drawSchema = z.object({
  drawMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid date format (YYYY-MM)'),
  drawType: z.enum(['random', 'algorithmic']),
  winningNumbers: z
    .array(z.number().int().min(1).max(45))
    .length(5, 'Must have exactly 5 winning numbers'),
})

export type DrawInput = z.infer<typeof drawSchema>

export const publishDrawSchema = z.object({
  drawId: z.string().uuid('Invalid draw ID'),
})

export type PublishDrawInput = z.infer<typeof publishDrawSchema>
