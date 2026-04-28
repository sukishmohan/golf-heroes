import type { Database } from '@/types/database.types'

export interface EmailTemplateProps {
  userName: string
  userEmail: string
}

/**
 * Welcome email template
 */
export function WelcomeEmailTemplate(props: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a3a2a; color: #fafaf7; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #fafaf7; padding: 40px 20px; border-radius: 0 0 8px 8px; }
          .cta { display: inline-block; background: #c9a84c; color: #1a3a2a; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Golf Heroes</h1>
          </div>
          <div class="content">
            <p>Hi ${props.userName},</p>
            <p>Thank you for joining Golf Heroes! We're excited to have you as part of our community.</p>
            <p>Golf Heroes combines your love of golf with the power to give. Every score you enter contributes to meaningful changes in our partner charities.</p>
            <p>To get started:</p>
            <ol>
              <li>Choose a charity you're passionate about</li>
              <li>Select your subscription plan</li>
              <li>Enter your golf scores</li>
              <li>Participate in monthly draws</li>
              <li>Win prizes and give back</li>
            </ol>
            <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Get Started</a></center>
          </div>
          <div class="footer">
            <p>&copy; 2026 Golf Heroes. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Subscription activated email template
 */
export function SubscriptionActivatedTemplate(props: {
  userName: string
  plan: string
  renewalDate: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a3a2a; color: #fafaf7; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #fafaf7; padding: 40px 20px; border-radius: 0 0 8px 8px; }
          .success { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Activated</h1>
          </div>
          <div class="content">
            <p>Hi ${props.userName},</p>
            <div class="success">
              <p><strong>Your ${props.plan} subscription is now active!</strong></p>
            </div>
            <p>You can now:</p>
            <ul>
              <li>Enter your golf scores</li>
              <li>Participate in monthly draws</li>
              <li>Support your chosen charity</li>
            </ul>
            <p><strong>Next renewal:</strong> ${props.renewalDate}</p>
            <p>Thank you for joining our community!</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Draw results email template
 */
export function DrawResultsTemplate(props: {
  userName: string
  drawMonth: string
  winningNumbers: number[]
  userMatches: number
  prizeAmount?: number
}): string {
  const hasWon = props.userMatches >= 3
  const matchText = `${props.userMatches} number${props.userMatches !== 1 ? 's' : ''} matched`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a3a2a; color: #fafaf7; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #fafaf7; padding: 40px 20px; border-radius: 0 0 8px 8px; }
          .winner { background: #fff3cd; border-left: 4px solid #c9a84c; padding: 15px; margin: 20px 0; }
          .numbers { font-size: 24px; font-weight: bold; color: #c9a84c; margin: 20px 0; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Draw Results - ${props.drawMonth}</h1>
          </div>
          <div class="content">
            <p>Hi ${props.userName},</p>
            <p>The results for the ${props.drawMonth} draw are in!</p>
            <p><strong>Winning numbers:</strong></p>
            <div class="numbers">${props.winningNumbers.join(' ')}</div>
            ${
              hasWon
                ? `<div class="winner">
                  <p><strong>Congratulations! You won!</strong></p>
                  <p>You matched ${matchText}</p>
                  ${props.prizeAmount ? `<p>Prize amount: $${props.prizeAmount.toFixed(2)}</p>` : ''}
                  <p>Check your dashboard for payment details.</p>
                </div>`
                : `<p>You matched ${matchText}. Better luck next month!</p>`
            }
            <p>Thank you for participating!</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Winner notification email template
 */
export function WinnerNotificationTemplate(props: {
  userName: string
  prizeAmount: number
  proofInstructions: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a3a2a; color: #fafaf7; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #fafaf7; padding: 40px 20px; border-radius: 0 0 8px 8px; }
          .next-steps { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You Won!</h1>
          </div>
          <div class="content">
            <p>Hi ${props.userName},</p>
            <p>Great news! You've won <strong>$${props.prizeAmount.toFixed(2)}</strong> in the Golf Heroes draw!</p>
            <div class="next-steps">
              <h3>What's next?</h3>
              <p>${props.proofInstructions}</p>
            </div>
            <p>Our team will review your submission and notify you of the verification status.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
