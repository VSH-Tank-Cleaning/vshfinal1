'use client'

import Link from 'next/link'
import { ArrowRight, Check, Droplets } from 'lucide-react'
import './reviews-page.css'

const serviceCommitments = [
  { title: 'Arrive within the confirmed visit window', description: 'We coordinate a suitable time and communicate clearly about the visit.' },
  { title: 'Confirm pricing before booking', description: 'Tank size and any applicable transport charge are shared upfront.' },
  { title: 'Clean carefully and explain the work', description: 'Our five-step process includes sludge removal, scrubbing and a thorough rinse.' },
  { title: 'Share useful service updates', description: 'Ask our team about photo updates during your cleaning.' },
]

export function ReviewsPage() {
  return (
    <section className="inner-page reviews-page">
      <div className="reviews-summary-grid">
        <aside className="reviews-summary-card">
          <span className="reviews-google-label"><span className="reviews-brand-mark">V</span> VSH customer feedback</span>
          <strong className="reviews-summary-title">Your experience,<br />in your own words.</strong>
          <p>We welcome honest feedback from customers across Delhi NCR.</p>
          <a className="reviews-primary-link" href="https://wa.me/919599057079?text=Hi%20VSH%2C%20I%27d%20like%20to%20share%20feedback%20about%20my%20tank%20cleaning." target="_blank" rel="noreferrer">Share feedback <ArrowRight size={16}/></a>
          <a className="reviews-secondary-link" href="tel:+919599057079">Call VSH Tank Cleaning</a>
          <small>We only share customer feedback with permission.</small>
        </aside>
        <div className="reviews-summary-story">
          <span className="eyebrow">HONEST FEEDBACK MATTERS</span>
          <h1>Read feedback in the customer&apos;s own words.</h1>
          <p>If you&apos;ve booked with VSH, share your experience directly with our team. We publish customer feedback only when its source is clear and the customer has agreed.</p>
          <a className="reviews-text-link" href="https://wa.me/919599057079?text=Hi%20VSH%2C%20I%27d%20like%20to%20share%20feedback%20about%20my%20tank%20cleaning." target="_blank" rel="noreferrer">Message us on WhatsApp <ArrowRight size={16}/></a>
        </div>
      </div>

      <section className="reviews-copy-section" aria-labelledby="reviews-why-title">
        <h2 id="reviews-why-title">Why we keep reviews honest</h2>
        <p>Ratings and testimonials should reflect real customer experiences. We share feedback only when its source is clear, and ask permission before publishing a customer&apos;s comment, name or photo.</p>
        <ul className="reviews-principles">
          <li><Check size={17}/><span><strong>Honest feedback only.</strong> We don&apos;t publish invented quotes or unverified ratings.</span></li>
          <li><Check size={17}/><span><strong>Your words stay yours.</strong> We ask before sharing a customer comment, name or photo.</span></li>
          <li><Check size={17}/><span><strong>We welcome all feedback.</strong> Tell us what went well or where we can improve.</span></li>
        </ul>
      </section>

      <section className="reviews-copy-section reviews-commitments" aria-labelledby="reviews-commitments-title">
        <h2 id="reviews-commitments-title">What to expect from the VSH team</h2>
        <p>Here are the service details we work to get right on every visit in Delhi NCR:</p>
        <ul className="reviews-principles">
          {serviceCommitments.map(({ title, description }, index) => (
            <li key={title}><span className="reviews-list-dot">{index + 1}</span><span><strong>{title}</strong> — {description}</span></li>
          ))}
        </ul>
      </section>

      <section className="reviews-copy-section reviews-contact-block" aria-labelledby="reviews-recent-title">
        <h2 id="reviews-recent-title">Had a VSH cleaning recently?</h2>
        <p>Your feedback helps us improve our tank cleaning service for homes, housing societies and businesses across Delhi NCR. Send our team a message or call us at <a href="tel:+919599057079">+91 95990 57079</a>.</p>
      </section>

      <section className="reviews-copy-section reviews-contact-block" aria-labelledby="reviews-help-title">
        <h2 id="reviews-help-title">Need help with a visit?</h2>
        <p>Please contact us directly with your booking details so we can understand the issue and help. Call <a href="tel:+919599057079">+91 95990 57079</a> or <a href="https://wa.me/919599057079" target="_blank" rel="noreferrer">message VSH on WhatsApp</a>.</p>
      </section>

      <div className="reviews-bottom-cta">
        <span className="reviews-bottom-icon" aria-hidden="true"><Droplets size={23}/></span>
        <div><span className="eyebrow">VSH TANK CLEANING · DELHI NCR</span><h2>Clear pricing. Careful tank cleaning.</h2><p>Tell us your area, tank type and capacity to plan a visit.</p></div>
        <Link className="button button-primary" href="/contact">Contact VSH <ArrowRight size={16}/></Link>
      </div>
    </section>
  )
}
