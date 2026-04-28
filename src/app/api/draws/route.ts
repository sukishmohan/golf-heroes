import { NextRequest, NextResponse } from 'next/server'
import { createClient, getServiceRoleClient } from '@/lib/supabase/server'
import { generateRandomNumbers } from '@/lib/draw-engine/random'
import { generateAlgorithmicNumbers } from '@/lib/draw-engine/algorithmic'
import { calculatePrizes, calculateMonthlyPoolAmount } from '@/lib/draw-engine/prize-calculator'
import { sendDrawResultsEmail } from '@/lib/email/sender'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = (await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()) as any

    if ((profile as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: draws } = (await supabase
      .from('draws')
      .select('*')
      .order('draw_month', { ascending: false })) as any

    return NextResponse.json({ draws })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = (await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()) as any

    if ((profile as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action, drawMonth, drawType } = body

    if (action === 'simulate') {
      // Simulate draw without saving
      const winningNumbers =
        drawType === 'algorithmic'
          ? await generateAlgorithmicNumbers(supabase)
          : generateRandomNumbers()

      // Get active subscriber count
      const { count: totalSubscribers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active')

      // Calculate monthly pool
      const totalPool = await calculateMonthlyPoolAmount(supabase)

      // Calculate prizes
      const prizeCalculation = await calculatePrizes(
        supabase,
        winningNumbers,
        totalSubscribers || 0,
        totalPool
      )

      return NextResponse.json({
        simulation: {
          winningNumbers,
          totalSubscribers,
          totalPool,
          prizes: prizeCalculation,
        },
      })
    }

    if (action === 'publish') {
      // Create draw and results
      const { drawId } = body

      if (!drawId) {
        return NextResponse.json({ error: 'Missing drawId' }, { status: 400 })
      }

      // Get the draft draw
      const { data: draftDraw, error: fetchError } = (await supabase
        .from('draws')
        .select('*')
        .eq('id', drawId)
        .single()) as any

      if (fetchError || !draftDraw) {
        return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
      }

      // Get service role client for admin operations
      const adminClient = await getServiceRoleClient()

      // Get all active profiles with scores
      const { data: profiles } = (await adminClient
        .from('profiles')
        .select('id, email, full_name')
        .eq('subscription_status', 'active')) as any

      if (!profiles || profiles.length === 0) {
        return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
      }

      // Create draw results
      const winners = await calculatePrizes(
        adminClient,
        draftDraw.winning_numbers,
        profiles.length,
        draftDraw.jackpot_amount || 0
      )

      // Insert draw results
      const resultsToInsert = winners.winners.map((winner) => ({
        draw_id: drawId,
        user_id: winner.userId,
        match_count: winner.matchCount,
        prize_amount: winner.prizeAmount,
        payment_status: 'pending' as const,
      }))

      if (resultsToInsert.length > 0) {
        const { error: insertError } = (await adminClient
          .from('draw_results')
          .insert(resultsToInsert as any)) as any

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }
      }

      // Update draw status
      await (adminClient
        .from('draws') as any)
        .update({
          status: 'published',
          total_subscribers: profiles.length,
        })
        .eq('id', drawId)

      // Send emails to all participants
      const { data: allProfiles } = (await adminClient
        .from('profiles')
        .select('id, email, full_name')
        .eq('subscription_status', 'active')) as any

      for (const prof of allProfiles || []) {
        const { data: scores } = (await adminClient
          .from('golf_scores')
          .select('score')
          .eq('user_id', prof.id)
          .order('score_date', { ascending: false })
          .limit(5)) as any

        if (scores) {
          let matchCount = 0
          scores.forEach((s: any) => {
            if ((draftDraw as any).winning_numbers.includes(s.score)) {
              matchCount++
            }
          })

          const winner = winners.winners.find((w) => w.userId === prof.id)
          await sendDrawResultsEmail(
            prof.email || '',
            prof.full_name || 'User',
            (draftDraw as any).draw_month,
            (draftDraw as any).winning_numbers,
            matchCount,
            winner?.prizeAmount
          )
        }
      }

      return NextResponse.json({ success: true, drawId })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing draw:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
