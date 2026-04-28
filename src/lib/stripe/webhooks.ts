import Stripe from 'stripe'
import { getServiceRoleClient } from '@/lib/supabase/server'

// Use placeholder key if not set (for development/testing)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build'

const stripe = new Stripe(stripeKey)

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder'

  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

export async function handleCheckoutCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  const session = event.data.object
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!customerId || !subscriptionId) {
    console.error('Missing customerId or subscriptionId in checkout.session.completed')
    return
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
  const priceId = subscription.items.data[0]?.price.id

  // Determine plan type
  const planType =
    priceId === process.env.STRIPE_MONTHLY_PRICE_ID
      ? 'monthly'
      : priceId === process.env.STRIPE_YEARLY_PRICE_ID
        ? 'yearly'
        : null

  // Get user by stripe_customer_id
  const supabase = await getServiceRoleClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('No profile found for customerId:', customerId)
    return
  }

  // Update subscription status
  const endDate = new Date((subscription as any).current_period_end * 1000)

  await (supabase
    .from('profiles') as any)
    .update({
      subscription_status: 'active',
      subscription_plan: planType,
      subscription_end_date: endDate.toISOString(),
    })
    .eq('id', (profile as any).id)
}

export async function handleSubscriptionDeleted(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const subscription = event.data.object
  const customerId = subscription.customer as string

  const supabase = await getServiceRoleClient()
  const { data: profile } = (await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()) as any

  if (!profile) {
    console.error('No profile found for customerId:', customerId)
    return
  }

  await (supabase
    .from('profiles') as any)
    .update({
      subscription_status: 'cancelled',
      subscription_plan: null,
    })
    .eq('id', (profile as any).id)
}

export async function handleSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
  const subscription = event.data.object
  const customerId = subscription.customer as string

  const supabase = await getServiceRoleClient()
  const { data: profile } = (await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()) as any

  if (!profile) {
    console.error('No profile found for customerId:', customerId)
    return
  }

  const priceId = (subscription as any).items.data[0]?.price.id
  const planType =
    priceId === process.env.STRIPE_MONTHLY_PRICE_ID
      ? 'monthly'
      : priceId === process.env.STRIPE_YEARLY_PRICE_ID
        ? 'yearly'
        : null

  const endDate = new Date((subscription as any).current_period_end * 1000)

  await (supabase
    .from('profiles') as any)
    .update({
      subscription_plan: planType,
      subscription_end_date: endDate.toISOString(),
    })
    .eq('id', (profile as any).id)
}

export async function handleInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
  const invoice = event.data.object
  const customerId = invoice.customer as string

  const supabase = await getServiceRoleClient()
  await (supabase
    .from('profiles') as any)
    .update({ subscription_status: 'past_due' })
    .eq('stripe_customer_id', customerId)
}
