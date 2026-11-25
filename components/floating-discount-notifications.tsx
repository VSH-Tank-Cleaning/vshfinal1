import Link from 'next/link'
import { Layers3, Percent } from 'lucide-react'

export function BookingDiscountPromos({ variant = 'floating' }: { variant?: 'floating' | 'inline' | 'mobile-actions' }) {
  return <section className={`booking-discount-promos booking-discount-promos--${variant}`} aria-label="Booking discounts">
    <div className="booking-discount-grid">
      <Link className="booking-discount-card" href="/prices" aria-label="Get an extra 10 percent off when you pay online. View prices.">
        <span className="booking-discount-icon"><Percent size={14} aria-hidden="true" /></span>
        <span className="booking-discount-copy">
          <strong>10% OFF</strong>
          <small>ONLINE</small>
        </span>
      </Link>
      <Link className="booking-discount-card" href="/prices" aria-label="Save 10 to 15 percent when booking multiple tanks. View prices.">
        <span className="booking-discount-icon"><Layers3 size={14} aria-hidden="true" /></span>
        <span className="booking-discount-copy">
          <strong>10–15%</strong>
          <small>MULTI-TANK</small>
        </span>
      </Link>
    </div>
  </section>
}
