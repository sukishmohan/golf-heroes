import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { scoreSchema } from '@/lib/validations/score'

const MAX_SCORES = 5

export async function getUserScores(
  client: SupabaseClient<Database>,
  userId: string
): Promise<Database['public']['Tables']['golf_scores']['Row'][]> {
  const { data, error } = await client
    .from('golf_scores')
    .select('*')
    .eq('user_id', userId)
    .order('score_date', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function addScore(
  client: SupabaseClient<Database>,
  userId: string,
  score: number,
  scoreDate: string
) {
  // Validate input
  const validated = scoreSchema.parse({ score, scoreDate })

  // Get current scores
  const { data: currentScores, error: fetchError } = (await client
    .from('golf_scores')
    .select('id, score_date')
    .eq('user_id', userId)
    .order('score_date', { ascending: true })) as any

  if (fetchError) {
    throw fetchError
  }

  // Check if score for this date already exists
  const existingScore = (currentScores as any)?.find((s: any) => s.score_date === scoreDate)
  if (existingScore) {
    throw new Error(`A score for ${scoreDate} already exists. Edit or delete it instead.`)
  }

  // If at max capacity, delete oldest score
  if (((currentScores as any)?.length || 0) >= MAX_SCORES) {
    const oldestScore = (currentScores as any)?.[0]
    if (oldestScore) {
      const { error: deleteError } = await client
        .from('golf_scores')
        .delete()
        .eq('id', oldestScore.id)

      if (deleteError) {
        throw deleteError
      }
    }
  }

  // Add new score
  const { data, error } = (await client
    .from('golf_scores')
    .insert({
      user_id: userId,
      score: validated.score,
      score_date: scoreDate,
    } as any)
    .select()
    .single()) as any

  if (error) {
    throw error
  }

  return data
}

export async function updateScore(
  client: SupabaseClient<Database>,
  userId: string,
  scoreId: string,
  score: number,
  scoreDate: string
) {
  // Validate input
  const validated = scoreSchema.parse({ score, scoreDate })

  // Check if this score exists and belongs to the user
  const { data: existingScore, error: fetchError } = (await client
    .from('golf_scores')
    .select('*')
    .eq('id', scoreId)
    .eq('user_id', userId)
    .single()) as any

  if (fetchError || !existingScore) {
    throw new Error('Score not found')
  }

  // Check if another score for this date exists (if date is different)
  if ((existingScore as any).score_date !== scoreDate) {
    const { data: conflictScore } = (await client
      .from('golf_scores')
      .select('id')
      .eq('user_id', userId)
      .eq('score_date', scoreDate)
      .single()) as any

    if (conflictScore) {
      throw new Error(`A score for ${scoreDate} already exists`)
    }
  }

  // Update score
  const { data, error } = (await (client
    .from('golf_scores') as any)
    .update({
      score: validated.score,
      score_date: scoreDate,
    })
    .eq('id', scoreId)
    .select()
    .single()) as any

  if (error) {
    throw error
  }

  return data
}

export async function deleteScore(
  client: SupabaseClient<Database>,
  userId: string,
  scoreId: string
) {
  const { error } = await client
    .from('golf_scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}

export function canAddScore(currentScoreCount: number): boolean {
  return currentScoreCount < MAX_SCORES
}

export function getScoreSlotInfo(currentScoreCount: number): {
  used: number
  max: number
  canAdd: boolean
  willReplace: boolean
} {
  return {
    used: currentScoreCount,
    max: MAX_SCORES,
    canAdd: currentScoreCount < MAX_SCORES,
    willReplace: currentScoreCount >= MAX_SCORES,
  }
}
