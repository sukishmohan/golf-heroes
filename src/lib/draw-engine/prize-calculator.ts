import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, GolfScore, DrawResult } from '@/types'

export interface PrizeCalculation {
  totalPool: number
  pool5match: number
  pool4match: number
  pool3match: number
  winners: DrawWinner[]
}

export interface DrawWinner {
  userId: string
  matchCount: number
  prizeAmount: number
}

/**
 * Calculate how many numbers match between user scores and winning numbers
 */
function calculateMatchCount(userScores: number[], winningNumbers: number[]): number {
  let matches = 0
  userScores.forEach((score) => {
    if (winningNumbers.includes(score)) {
      matches++
    }
  })
  return matches
}

/**
 * Calculate prizes for all users based on draw results
 */
export async function calculatePrizes(
  client: SupabaseClient<Database>,
  winningNumbers: number[],
  totalSubscribers: number,
  totalPoolAmount: number,
  jackpot: number = 0
): Promise<PrizeCalculation> {
  const { data: config } = (await client
    .from('prize_pool_config')
    .select('*')
    .single()) as any

  const poolPercentage5 = (config as any)?.pool_percentage_5match || 40
  const poolPercentage4 = (config as any)?.pool_percentage_4match || 35
  const poolPercentage3 = (config as any)?.pool_percentage_3match || 25

  // Calculate pool amounts
  const availablePool = totalPoolAmount - jackpot
  const pool5match = (availablePool * poolPercentage5) / 100 + jackpot
  const pool4match = (availablePool * poolPercentage4) / 100
  const pool3match = (availablePool * poolPercentage3) / 100

  // Get all active users with their scores
  const { data: profiles } = (await client
    .from('profiles')
    .select('id')
    .eq('subscription_status', 'active')) as any

  const winners: DrawWinner[] = []

  if (profiles) {
    for (const profile of profiles) {
      // Get user's 5 scores
      const { data: scores } = (await client
        .from('golf_scores')
        .select('score')
        .eq('user_id', (profile as any).id)
        .order('score_date', { ascending: false })
        .limit(5)) as any

      if (scores && scores.length > 0) {
        const userScores = scores.map((s: any) => s.score)
        const matchCount = calculateMatchCount(userScores, winningNumbers)

        if (matchCount >= 3) {
          winners.push({
            userId: (profile as any).id,
            matchCount,
            prizeAmount: 0, // Will be calculated when splitting
          })
        }
      }
    }
  }

  // Split prizes among winners by tier
  const winners5Match = winners.filter((w) => w.matchCount === 5)
  const winners4Match = winners.filter((w) => w.matchCount === 4)
  const winners3Match = winners.filter((w) => w.matchCount === 3)

  // Assign prize amounts
  if (winners5Match.length > 0) {
    const prizePerWinner = pool5match / winners5Match.length
    winners5Match.forEach((w) => {
      w.prizeAmount = prizePerWinner
    })
  } else {
    // Rollover jackpot to next draw (not distributed)
  }

  if (winners4Match.length > 0) {
    const prizePerWinner = pool4match / winners4Match.length
    winners4Match.forEach((w) => {
      w.prizeAmount = prizePerWinner
    })
  }

  if (winners3Match.length > 0) {
    const prizePerWinner = pool3match / winners3Match.length
    winners3Match.forEach((w) => {
      w.prizeAmount = prizePerWinner
    })
  }

  return {
    totalPool: totalPoolAmount,
    pool5match,
    pool4match,
    pool3match,
    winners: [...winners5Match, ...winners4Match, ...winners3Match],
  }
}

/**
 * Calculate active subscription revenue for the current month
 */
export async function calculateMonthlyPoolAmount(
  client: SupabaseClient<Database>,
  currentDate: Date = new Date()
): Promise<number> {
  const { data: config } = (await client
    .from('prize_pool_config')
    .select('subscription_fee_monthly, subscription_fee_yearly')
    .single()) as any

  // Get active subscribers
  const { data: profiles } = (await client
    .from('profiles')
    .select('subscription_plan')
    .eq('subscription_status', 'active')) as any

  if (!profiles || profiles.length === 0) {
    return 0
  }

  let totalAmount = 0
  profiles.forEach((profile: any) => {
    if (profile.subscription_plan === 'monthly') {
      totalAmount += (config as any)?.subscription_fee_monthly || 9.99
    } else if (profile.subscription_plan === 'yearly') {
      // Amortize yearly fee monthly
      totalAmount += ((config as any)?.subscription_fee_yearly || 99.99) / 12
    }
  })

  return totalAmount
}
