import Link from 'next/link'
import { ArrowRight, Layers3, Percent } from 'lucide-react'

export function BookingDiscountPromos() {
  return <section className="booking-discount-promos" aria-labelledby="booking-discount-heading">
    <h2 className="sr-only" id="booking-discount-heading">Booking discounts</h2>
    <div className="booking-discount-grid">
      <Link className="booking-discount-card" href="/prices" aria-label="Get an extra 10 percent off when you pay online. View prices.">
        <span className="booking-discount-icon"><Percent size={15} aria-hidden="true" /></span>
        <span className="booking-discount-copy">
          <strong>10% off online</strong>
          <small>Pay online and save</small>
        </span>
        <ArrowRight className="booking-discount-arrow" size={14} aria-hidden="true" />
      </Link>
      <Link className="booking-discount-card" href="/prices" aria-label="Save 10 to 15 percent when booking multiple tanks. View prices.">
        <span className="booking-discount-icon"><Layers3 size={15} aria-hidden="true" /></span>
        <span className="booking-discount-copy">
          <strong>Save 10–15%</strong>
          <small>2 tanks 10% · 3–5 12% · 6+ 15%</small>
        </span>
        <ArrowRight className="booking-discount-arrow" size={14} aria-hidden="true" />
      </Link>
    </div>
  </section>
}
