import Stripe from 'stripe'

// Use placeholder key if not set (for development/testing)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
})

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  return session.url
}

export async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
  })

  return subscriptions.data
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}
