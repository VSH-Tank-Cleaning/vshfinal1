'use client'

import Script from 'next/script'
import { useState, type FormEvent } from 'react'
import { calculateBookingDiscounts, type BookingItem, type PaymentMode } from '@/lib/razorpay'
import { SERVICEABLE_PINCODE_PATTERN } from '@/lib/service-areas'

type CustomerDetails = {
  name: string
  phone: string
  email: string
  address: string
  area: string
  pincode: string
  preferredDate: string
  timeSlot: string
  notes: string
}

type RazorpayPayment = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { name: string; email?: string; contact: string }
  notes: Record<string, string>
  theme: { color: string }
  handler: (payment: RazorpayPayment) => void | Promise<void>
  modal: { ondismiss: () => void }
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

const emptyDetails: CustomerDetails = {
  name: '',
  phone: '',
  email: '',
  address: '',
  area: '',
  pincode: '',
  preferredDate: '',
  timeSlot: '',
  notes: '',
}

export function RazorpayCheckout({ items, onPaymentComplete }: { items: BookingItem[]; onPaymentComplete: (mode: PaymentMode, bookingId: string) => void }) {
  const [customer, setCustomer] = useState(emptyDetails)
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('online')
  const [scriptReady, setScriptReady] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const discounts = calculateBookingDiscounts(items, paymentMode)
  const advanceDiscounts = calculateBookingDiscounts(items, 'advance')
  const onlineDiscounts = calculateBookingDiscounts(items, 'online')
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

  function updateCustomer(field: keyof CustomerDetails, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  async function submitAfterService() {
    setProcessing(true)
    setMessage('')
    try {
      const response = await fetch('/api/booking/after-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer }),
      })
      const data = await response.json().catch(() => null)
      const bookingId = typeof data?.bookingId === 'string' ? data.bookingId.trim() : ''
      if (!response.ok || data?.confirmed !== true || !bookingId) {
        throw new Error(data?.error || 'We could not save your booking. Please try again.')
      }
      onPaymentComplete('after-service', bookingId)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not save your booking. Please try again.')
      setProcessing(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (paymentMode === 'after-service') return submitAfterService()
    if (!window.Razorpay || !scriptReady) {
      setMessage('Secure checkout is still loading. Please try again in a moment.')
      return
    }

    setProcessing(true)
    setMessage('')

    try {
      const orderResponse = await fetch('/api/razorpay/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer, paymentMode }),
      })
      const orderData = await orderResponse.json().catch(() => null)
      if (!orderResponse.ok || !orderData?.orderId || !orderData?.keyId) {
        throw new Error(orderData?.error || 'We could not start checkout. Please try again.')
      }

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VSH Tank Cleaning',
        description: paymentMode === 'advance' ? '15% advance payment for tank cleaning' : 'Tank cleaning service booking',
        order_id: orderData.orderId,
        prefill: { name: customer.name, ...(customer.email ? { email: customer.email } : {}), contact: customer.phone },
        notes: { service_area: customer.area, pincode: customer.pincode },
        theme: { color: '#17628b' },
        handler: async (payment) => {
          try {
            const verificationResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items,
                paymentMode,
                orderId: payment.razorpay_order_id,
                paymentId: payment.razorpay_payment_id,
                signature: payment.razorpay_signature,
              }),
            })
            const verificationData = await verificationResponse.json().catch(() => null)
            const bookingId = typeof verificationData?.bookingId === 'string' ? verificationData.bookingId.trim() : ''
            if (!verificationResponse.ok || verificationData?.verified !== true || !bookingId) {
              throw new Error(verificationData?.error || 'We could not confirm this payment. Please contact our team with your payment ID.')
            }
            onPaymentComplete(paymentMode, bookingId)
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'We could not confirm this payment. Please contact our team.')
            setProcessing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            setMessage('Checkout was closed before payment was completed.')
          },
        },
      })

      checkout.open()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not start checkout. Please try again.')
      setProcessing(false)
    }
  }

  return <div className="razorpay-checkout">
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => setMessage('Secure checkout could not load. Refresh the page and try again.')} />
    <h3>Complete your booking</h3>
    <p className="razorpay-intro">Choose a visit time and save with our multi-tank, online, or advance payment offers.</p>
    <form className="razorpay-form" onSubmit={handleSubmit}>
      <section className="checkout-step" aria-labelledby="booking-summary-heading">
        <h4 id="booking-summary-heading">Booking summary</h4>
        <div className="discount-breakdown" aria-live="polite">
          <div><span>Booking subtotal</span><strong>₹{discounts.subtotal.toLocaleString('en-IN')}</strong></div>
          {discounts.volumePercent > 0 && <div><span>{discounts.volumePercent}% multi-tank savings ({discounts.tankCount} tanks)</span><strong>−₹{discounts.volumeAmount.toLocaleString('en-IN')}</strong></div>}
          {paymentMode === 'online' && <div><span>{discounts.onlinePercent}% online payment savings</span><strong>−₹{discounts.onlineAmount.toLocaleString('en-IN')}</strong></div>}
          {paymentMode === 'advance' && <div><span>{discounts.advancePercent}% advance booking discount</span><strong>−₹{discounts.advanceAmount.toLocaleString('en-IN')}</strong></div>}
          <div className="discount-total"><span>{paymentMode === 'advance' ? 'Order total after discount' : paymentMode === 'online' ? 'Pay online' : 'Pay after service'}</span><strong>₹{discounts.total.toLocaleString('en-IN')}</strong></div>
          {paymentMode === 'advance' && <><div><span>15% advance due now</span><strong>₹{discounts.paymentAmount.toLocaleString('en-IN')}</strong></div><div><span>Balance due after service</span><strong>₹{discounts.balanceAmount.toLocaleString('en-IN')}</strong></div></>}
          <p>Volume offer: 10% on 2 tanks, 12% on 3–5 tanks, and 15% on 6 or more tanks.</p>
        </div>
      </section>
      <section className="checkout-step" aria-labelledby="checkout-payment-heading">
        <h4 id="checkout-payment-heading">1. Payment</h4>
        <fieldset className="razorpay-payment-mode" disabled={processing}>
          <legend className="sr-only">Choose a payment option</legend>
          <label className={paymentMode === 'after-service' ? 'selected' : ''}>
            <input type="radio" name="paymentMode" value="after-service" checked={paymentMode === 'after-service'} onChange={() => setPaymentMode('after-service')} />
            <span className="payment-option-copy"><strong>Pay after service</strong><small>Cash or UPI once the job is done — ₹{calculateBookingDiscounts(items).total.toLocaleString('en-IN')}.</small></span>
          </label>
          <label className={paymentMode === 'advance' ? 'selected' : ''}>
            <input type="radio" name="paymentMode" value="advance" checked={paymentMode === 'advance'} onChange={() => setPaymentMode('advance')} />
            <span className="payment-option-copy"><strong>Pay 15% advance <span className="payment-saving">Save ₹{(advanceDiscounts.volumeAmount + advanceDiscounts.advanceAmount).toLocaleString('en-IN')}</span></strong><small>Pay ₹{advanceDiscounts.paymentAmount.toLocaleString('en-IN')} now, get 5% off the order, and pay ₹{advanceDiscounts.balanceAmount.toLocaleString('en-IN')} after service.</small></span>
          </label>
          <label className={paymentMode === 'online' ? 'selected' : ''}>
            <input type="radio" name="paymentMode" value="online" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} />
            <span className="payment-option-copy"><strong>Pay online now <span className="payment-saving">Save ₹{(onlineDiscounts.volumeAmount + onlineDiscounts.onlineAmount).toLocaleString('en-IN')}</span></strong><small>Pay ₹{onlineDiscounts.total.toLocaleString('en-IN')} instead of ₹{onlineDiscounts.subtotal.toLocaleString('en-IN')} — {onlineDiscounts.volumePercent ? `${onlineDiscounts.volumePercent}% multi-tank discount + ` : ''}{onlineDiscounts.onlinePercent}% off for paying online.</small></span>
          </label>
        </fieldset>
      </section>
      <section className="checkout-step" aria-labelledby="checkout-contact-heading">
        <h4 id="checkout-contact-heading">2. Your details</h4>
        <div className="razorpay-field-row">
          <div className="razorpay-field">
            <label htmlFor="booking-name">Full name *</label>
            <input id="booking-name" name="name" autoComplete="name" value={customer.name} onChange={(event) => updateCustomer('name', event.target.value)} maxLength={100} required />
          </div>
          <div className="razorpay-field">
            <label htmlFor="booking-phone">Phone number *</label>
            <input id="booking-phone" name="phone" type="tel" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit phone number" placeholder="98765 43210" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} maxLength={10} required />
          </div>
        </div>
        <div className="razorpay-field">
          <label htmlFor="booking-email">Email address (optional)</label>
          <input id="booking-email" name="email" type="email" autoComplete="email" value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} maxLength={254} />
        </div>
      </section>
      <section className="checkout-step" aria-labelledby="checkout-address-heading">
        <h4 id="checkout-address-heading">3. Service address</h4>
        <div className="razorpay-field">
          <label htmlFor="booking-address">Full address *</label>
          <textarea id="booking-address" name="address" autoComplete="street-address" rows={2} value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} maxLength={240} required />
        </div>
        <div className="razorpay-field-row">
          <div className="razorpay-field">
            <label htmlFor="booking-area">Area / locality *</label>
            <input id="booking-area" name="area" autoComplete="address-level2" value={customer.area} onChange={(event) => updateCustomer('area', event.target.value)} maxLength={100} required />
          </div>
          <div className="razorpay-field">
            <label htmlFor="booking-pincode">PIN code *</label>
            <input id="booking-pincode" name="pincode" autoComplete="postal-code" inputMode="numeric" pattern={SERVICEABLE_PINCODE_PATTERN} title="Enter a six-digit PIN code starting with 110, 121, 122, or 201" aria-describedby="booking-pincode-help" value={customer.pincode} onChange={(event) => updateCustomer('pincode', event.target.value)} maxLength={6} required />
            <small id="booking-pincode-help">We currently serve Delhi (110xxx), Faridabad (121xxx), Gurgaon (122xxx), Noida, Greater Noida and Ghaziabad (201xxx).</small>
          </div>
        </div>
      </section>
      <section className="checkout-step" aria-labelledby="checkout-schedule-heading">
        <h4 id="checkout-schedule-heading">4. Preferred date &amp; time</h4>
        <div className="razorpay-field-row">
          <div className="razorpay-field">
            <label htmlFor="booking-date">Date *</label>
            <input id="booking-date" name="preferredDate" type="date" min={minDate} value={customer.preferredDate} onChange={(event) => updateCustomer('preferredDate', event.target.value)} required />
          </div>
          <div className="razorpay-field">
            <label htmlFor="booking-slot">Time slot *</label>
            <select id="booking-slot" name="timeSlot" value={customer.timeSlot} onChange={(event) => updateCustomer('timeSlot', event.target.value)} required>
              <option value="">Choose a slot</option>
              <option>8:00 AM – 10:00 AM</option>
              <option>10:00 AM – 12:00 PM</option>
              <option>12:00 PM – 2:00 PM</option>
              <option>2:00 PM – 4:00 PM</option>
              <option>6:00 PM – 8:00 PM</option>
            </select>
          </div>
        </div>
        <div className="razorpay-field">
          <label htmlFor="booking-notes">Special instructions</label>
          <textarea id="booking-notes" name="notes" rows={2} placeholder="Roof access, sump under parked car, society gate pass, pets…" value={customer.notes} onChange={(event) => updateCustomer('notes', event.target.value)} maxLength={200} />
        </div>
      </section>
      <label className="razorpay-consent"><input type="checkbox" required /><span>I agree that VSH Tank Cleaning may use these details to arrange and confirm my service.</span></label>
      <p className="razorpay-privacy">Your booking details are sent securely to our team and are not used to change your selected prices.</p>
      {message && <p className="razorpay-message" role="alert">{message}</p>}
      <button className="button button-primary razorpay-submit" type="submit" disabled={processing || (paymentMode !== 'after-service' && !scriptReady)}>
        {processing ? 'Please wait…' : paymentMode === 'after-service' ? 'Confirm booking' : paymentMode === 'advance' ? scriptReady ? `Pay ₹${discounts.paymentAmount.toLocaleString('en-IN')} advance` : 'Loading secure checkout…' : scriptReady ? 'Continue to secure payment' : 'Loading secure checkout…'}
      </button>
      {paymentMode !== 'after-service' && <p className="razorpay-powered">Payments are processed securely by Razorpay.</p>}
    </form>
  </div>
}
