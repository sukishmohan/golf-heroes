import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Generate 5 winning numbers using weighted probability based on user score frequency
 */
export async function generateAlgorithmicNumbers(
  client: SupabaseClient<Database>
): Promise<number[]> {
  // Get all scores with their frequencies
  const { data: scores, error } = (await client
    .from('golf_scores')
    .select('score')) as any

  if (error) {
    throw error
  }

  // Count frequency of each number (1-45)
  const frequency: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) {
    frequency[i] = 0
  }

  if (scores) {
    scores.forEach((row: any) => {
      const score = row.score
      if (score >= 1 && score <= 45) {
        frequency[score]++
      }
    })
  }

  // Create weighted array
  const weighted: number[] = []
  for (let i = 1; i <= 45; i++) {
    const count = Math.max(1, frequency[i]) // At least weight of 1
    for (let j = 0; j < count; j++) {
      weighted.push(i)
    }
  }

  // Pick 5 unique numbers using weighted selection
  const selected = new Set<number>()
  while (selected.size < 5) {
    const randomIndex = Math.floor(Math.random() * weighted.length)
    selected.add(weighted[randomIndex])
  }

  return Array.from(selected).sort((a, b) => a - b)
}
