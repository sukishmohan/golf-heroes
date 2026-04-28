'use client'

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1a3a2a] mb-12 text-center">How Golf Heroes Works</h1>

      <div className="space-y-12">
        {/* Step 1 */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c9a84c] text-[#1a3a2a] rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Subscribe & Choose Your Charity</h2>
              <p className="text-gray-600 mb-4">
                Start by creating an account and choosing your subscription plan (Monthly or Yearly).
                Select a charity that matches your values – every subscription contributes directly to
                your chosen cause.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Monthly plan: $9.99/month</li>
                <li>Yearly plan: $99.99/year (20% savings)</li>
                <li>Minimum 10% of fees go to your chosen charity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c9a84c] text-[#1a3a2a] rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              2
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Track Your Golf Scores</h2>
              <p className="text-gray-600 mb-4">
                Enter your Stableford scores (1-45) after each round. You can store up to 5 scores at
                any time. When you add a 6th score, the oldest one automatically rolls off.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>One score per day (update or delete if needed)</li>
                <li>Scores display newest first</li>
                <li>Your 5 most recent scores compete in draws</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c9a84c] text-[#1a3a2a] rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              3
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Monthly Draws</h2>
              <p className="text-gray-600 mb-4">
                Every month, we conduct a draw using 5 winning numbers (1-45). The draw can be random
                or weighted by the scores entered by our community.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Random draws: 5 random numbers between 1-45</li>
                <li>Algorithmic draws: weighted by score frequency</li>
                <li>Your 5 scores are matched against the winning numbers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c9a84c] text-[#1a3a2a] rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              4
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Win Prizes</h2>
              <p className="text-gray-600 mb-4">
                Match 3, 4, or 5 winning numbers to win a prize. Prizes are calculated from the
                community pool and split equally among all winners at each tier.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>5 matches: 40% of prize pool (jackpot)</li>
                <li>4 matches: 35% of prize pool</li>
                <li>3 matches: 25% of prize pool</li>
                <li>No 5-match winner? Jackpot rolls to next month</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c9a84c] text-[#1a3a2a] rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
              5
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Verify & Get Paid</h2>
              <p className="text-gray-600 mb-4">
                Winners submit proof of their winning scores. Our team verifies the claim, and upon
                approval, the prize is transferred to your account.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Upload screenshot evidence</li>
                <li>Admin team verifies within 48 hours</li>
                <li>Approved prizes are paid to your bank account</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-[#1a3a2a] mb-8">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#1a3a2a] mb-2">Can I change my charity later?</h3>
            <p className="text-gray-600">
              Yes! You can change your selected charity anytime from your dashboard. You can also
              increase the percentage contributed to your charity above the minimum 10%.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1a3a2a] mb-2">What if I want to cancel?</h3>
            <p className="text-gray-600">
              You can cancel your subscription anytime. Once cancelled, you won't be eligible for
              future draws, but past winnings remain valid.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1a3a2a] mb-2">How do I know the draws are fair?</h3>
            <p className="text-gray-600">
              All draws are conducted using cryptographically secure random number generation. We
              publish draw results and winner details on our website for transparency.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1a3a2a] mb-2">What score format do you use?</h3>
            <p className="text-gray-600">
              We use Stableford scoring (1-45). This format is widely used in golf and simplifies
              scoring across different handicaps and course difficulties.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
