'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'

type SubmissionState = 'idle' | 'sending' | 'success' | 'error'

export function ContactQuestion() {
  return <Link className="floating-question-trigger" href="/prices#contact-form" aria-label="Ask a question about tank cleaning">
    <MessageCircle size={18} aria-hidden="true" />
    <span>Ask a question</span>
  </Link>
}

export function ContactForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setSubmissionState('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          remarks: formData.get('remarks'),
          website: formData.get('website'),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'The message could not be sent.')
      }
      setSubmissionState('success')
      form.reset()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We couldn’t send your message. Please try again.')
      setSubmissionState('error')
    }
  }

  return <section id="contact-form" className="prices-contact-section" aria-labelledby="contact-question-title">
    <div className="prices-contact-intro">
      <span className="eyebrow">WE’RE HERE TO HELP</span>
      <h2 id="contact-question-title">Any questions?</h2>
      <p>Leave a remark or ask us anything about tank size, pricing, or service. Our team will get back to you.</p>
      <div className="prices-contact-direct"><span>Prefer to talk?</span><a href="tel:+919599057079">+91 95990 57079</a></div>
    </div>
    <div className="prices-contact-panel">
      {submissionState === 'success' ? (
        <div className="contact-form-success" role="status">
          <h3>Thanks for reaching out.</h3>
          <p>Your message has been sent to our team. We’ll be in touch soon.</p>
          <button type="button" onClick={() => setSubmissionState('idle')}>Send another message</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="contact-form-field">
            Your name
            <input name="name" autoComplete="name" maxLength={100} required placeholder="Full name" />
          </label>
          <label className="contact-form-field">
            Email address
            <input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" />
          </label>
          <label className="contact-form-field">
            Phone number <span>(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit phone number, or leave the field empty" maxLength={10} placeholder="10-digit number" />
          </label>
          <label className="contact-form-field contact-form-message">
            Remarks or questions
            <textarea name="remarks" minLength={5} maxLength={2000} required placeholder="Tell us how we can help…" />
          </label>
          <label className="contact-honeypot" aria-hidden="true" tabIndex={-1}>
            Leave this field empty
            <input name="website" autoComplete="off" tabIndex={-1} />
          </label>
          {submissionState === 'error' && <p className="contact-form-status" role="alert">{errorMessage || 'We couldn’t send your message. Please try again or call us on +91 95990 57079.'}</p>}
          <button className="contact-form-submit" type="submit" disabled={submissionState === 'sending'}>
            {submissionState === 'sending' ? 'Sending…' : 'Send enquiry'}
            {submissionState !== 'sending' && <ArrowRight size={16} aria-hidden="true" />}
          </button>
          <p className="contact-form-note">Your details are only used to reply to your enquiry.</p>
        </form>
      )}
    </div>
  </section>
}
