import { NextRequest, NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  handleCheckoutCompleted,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
  handleInvoicePaymentFailed,
} from '@/lib/stripe/webhooks'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  try {
    const event = await verifyWebhookSignature(body, signature)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event as any)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event as any)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event as any)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event as any)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
