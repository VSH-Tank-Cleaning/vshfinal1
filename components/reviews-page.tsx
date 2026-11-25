'use client'

import Link from 'next/link'
import { ArrowRight, Check, Clock3, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import './reviews-page.css'

const feedbackTopics = [
  { icon: Clock3, title: 'Was our team on time?', description: 'Tell us how the booking and visit timing worked for you.' },
  { icon: ShieldCheck, title: 'Did we respect your space?', description: 'Let us know how we handled your home, building and tank area.' },
  { icon: Sparkles, title: 'Was everything clear?', description: 'Share whether our process and service updates were easy to follow.' },
]

export function ReviewsPage() {
  return (
    <section className="inner-page reviews-page">
      <div className="inner-hero reviews-hero">
        <span className="eyebrow">YOUR EXPERIENCE MATTERS</span>
        <h1>Good service deserves an honest conversation.</h1>
        <p>We want every VSH Tank Cleaning visit to feel straightforward, careful and respectful. Your feedback helps us understand what went well and where we can do better.</p>
      </div>

      <div className="reviews-content">
        <aside className="reviews-invite">
          <div className="reviews-invite-mark" aria-hidden="true"><MessageCircle size={25} /></div>
          <span className="eyebrow">A NOTE TO OUR CUSTOMERS</span>
          <h2>Tell us about your visit.</h2>
          <p>Had a recent tank cleaning with our team? Get in touch and share your feedback directly. We read every message and use it to keep improving our service.</p>
          <a className="button button-primary" href="https://wa.me/919599057079" target="_blank" rel="noreferrer">
            Share feedback on WhatsApp <ArrowRight size={16} />
          </a>
          <a className="reviews-call-link" href="tel:+919599057079">Prefer to call? +91 95990 57079</a>
        </aside>

        <div className="reviews-detail">
          <div className="reviews-detail-heading">
            <span className="eyebrow">WHAT WE CARE ABOUT</span>
            <h2>Every part of the visit counts.</h2>
            <p>There is no script to follow. Let us know what your experience was really like.</p>
          </div>
          <div className="reviews-topic-list">
            {feedbackTopics.map(({ icon: Icon, title, description }, index) => (
              <article className="reviews-topic" key={title}>
                <span className="reviews-topic-icon"><Icon size={19} /></span>
                <div><span className="reviews-topic-index">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>
                <Check className="reviews-topic-check" size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="reviews-note"><span>VSH</span><p>We do not publish customer names, photos or comments without permission.</p></div>
        </div>
      </div>

      <div className="reviews-bottom-cta">
        <div><span className="eyebrow">READY FOR YOUR NEXT CLEAN?</span><h2>Thoughtful tank care, from the first call.</h2></div>
        <Link className="button button-primary" href="/contact">Plan a visit <ArrowRight size={16} /></Link>
      </div>
    </section>
  )
}
