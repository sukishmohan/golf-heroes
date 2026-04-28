import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a3a2a] text-[#fafaf7] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Golf Heroes</h3>
            <p className="text-sm text-gray-300">
              Combining your love of golf with the power to give.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#c9a84c] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#c9a84c] transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/charities" className="hover:text-[#c9a84c] transition">
                  Charities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#c9a84c] transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c9a84c] transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-300">sukishmohan2527@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Golf Heroes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
