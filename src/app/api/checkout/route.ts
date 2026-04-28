import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, stripe } from '@/lib/stripe/client'

export async function POST(request: NextRequest) {
  try {
    const { priceId, email } = await request.json()

    if (!priceId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create Stripe customer
    let { data: profile } = (await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()) as any

    let customerId = (profile as any)?.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email || email,
        metadata: {
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Save to database
      await (supabase
        .from('profiles') as any)
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const sessionUrl = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    return NextResponse.json({ url: sessionUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
