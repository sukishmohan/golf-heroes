import { z } from 'zod'

export const scoreSchema = z.object({
  score: z
    .number()
    .int()
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  scoreDate: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate <= today
    }, 'Score date cannot be in the future'),
})

export type ScoreInput = z.infer<typeof scoreSchema>

export const updateScoreSchema = z.object({
  scoreId: z.string().uuid('Invalid score ID'),
  score: z
    .number()
    .int()
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  scoreDate: z.string(),
})

export type UpdateScoreInput = z.infer<typeof updateScoreSchema>
