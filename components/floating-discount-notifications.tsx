import Link from 'next/link'
import { ArrowRight, Layers3, Percent } from 'lucide-react'

export function FloatingDiscountNotifications() {
  return <nav className="floating-discount-notifications" aria-label="Booking discounts">
    <Link className="floating-discount-card" href="/prices" aria-label="Get an extra 10 percent off when you pay online. View prices.">
      <span className="floating-discount-icon"><Percent size={17} aria-hidden="true" /></span>
      <span className="floating-discount-copy">
        <strong>Extra 10% off</strong>
        <small>When you pay online</small>
      </span>
      <ArrowRight className="floating-discount-arrow" size={16} aria-hidden="true" />
    </Link>
    <Link className="floating-discount-card" href="/prices" aria-label="Save 10 to 15 percent when booking multiple tanks. View prices.">
      <span className="floating-discount-icon"><Layers3 size={17} aria-hidden="true" /></span>
      <span className="floating-discount-copy">
        <strong>Save 10–15%</strong>
        <small>10% for 2 · 12% for 3–5 · 15% for 6+</small>
      </span>
      <ArrowRight className="floating-discount-arrow" size={16} aria-hidden="true" />
    </Link>
  </nav>
}
