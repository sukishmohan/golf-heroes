import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addScore, updateScore, deleteScore, getUserScores } from '@/lib/scores/management'
import { scoreSchema } from '@/lib/validations/score'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription status
    const { data: profile } = (await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()) as any

    if (!(profile as any) || (profile as any).subscription_status !== 'active') {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
    }

    const scores = await getUserScores(supabase, user.id)
    return NextResponse.json({ scores })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching scores:', message)
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

    // Check subscription status
    const { data: profile } = (await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()) as any

    if (!(profile as any) || (profile as any).subscription_status !== 'active') {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
    }

    const body = await request.json()
    const { score, scoreDate } = scoreSchema.parse(body)

    const newScore = await addScore(supabase, user.id, score, scoreDate)
    return NextResponse.json({ score: newScore }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error.issues as any)[0]?.message || 'Validation error' }, { status: 400 })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error adding score:', message)

    // Check for duplicate score error
    if (message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A score for this date already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { scoreId, score, scoreDate } = z
      .object({
        scoreId: z.string().uuid(),
        score: z.number().int().min(1).max(45),
        scoreDate: z.string(),
      })
      .parse(body)

    const updatedScore = await updateScore(supabase, user.id, scoreId, score, scoreDate)
    return NextResponse.json({ score: updatedScore })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error.issues as any)[0]?.message || 'Validation error' }, { status: 400 })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error updating score:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const scoreId = searchParams.get('id')

    if (!scoreId) {
      return NextResponse.json({ error: 'Missing score ID' }, { status: 400 })
    }

    await deleteScore(supabase, user.id, scoreId)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting score:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
