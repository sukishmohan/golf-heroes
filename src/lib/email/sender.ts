import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent. Configure .env.local with real API key.')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }
  
  try {
    const result = await resend.emails.send({
      from: 'noreply@golfheroes.com',
      to,
      subject,
      html,
    })

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed to send email:', message)
    return { success: false, error: message }
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const { WelcomeEmailTemplate } = await import('./templates')
  const html = WelcomeEmailTemplate({ userName: name, userEmail: email })

  await sendEmail(email, 'Welcome to Golf Heroes', html)
}

export async function sendSubscriptionActivatedEmail(
  email: string,
  name: string,
  plan: string,
  renewalDate: string
): Promise<void> {
  const { SubscriptionActivatedTemplate } = await import('./templates')
  const html = SubscriptionActivatedTemplate({ userName: name, plan, renewalDate })

  await sendEmail(email, 'Subscription Activated', html)
}

export async function sendDrawResultsEmail(
  email: string,
  name: string,
  drawMonth: string,
  winningNumbers: number[],
  userMatches: number,
  prizeAmount?: number
): Promise<void> {
  const { DrawResultsTemplate } = await import('./templates')
  const html = DrawResultsTemplate({
    userName: name,
    drawMonth,
    winningNumbers,
    userMatches,
    prizeAmount,
  })

  await sendEmail(email, `Draw Results - ${drawMonth}`, html)
}

export async function sendWinnerNotificationEmail(
  email: string,
  name: string,
  prizeAmount: number,
  proofInstructions: string
): Promise<void> {
  const { WinnerNotificationTemplate } = await import('./templates')
  const html = WinnerNotificationTemplate({ userName: name, prizeAmount, proofInstructions })

  await sendEmail(email, '🎉 You Won! - Golf Heroes', html)
}
