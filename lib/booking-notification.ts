import type { BookingItem, CustomerDetails } from '@/lib/razorpay'
import { calculateBookingDiscounts, calculateBookingTotal } from '@/lib/razorpay'

type BookingPaymentStatus = 'paid' | 'advance-paid' | 'due-after-service'

type BookingNotification = {
  customer: CustomerDetails
  items: BookingItem[]
  paymentStatus: BookingPaymentStatus
  bookingId: string
  paymentId?: string
  idempotencyKey: string
}

type ResendEmail = {
  from: string
  to: string[]
  subject: string
  text: string
  reply_to?: string
}

async function sendEmail(apiKey: string, idempotencyKey: string, email: ResendEmail): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(email),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function sendBookingNotification({
  customer,
  items,
  paymentStatus,
  bookingId,
  paymentId,
  idempotencyKey,
}: BookingNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL

  if (!apiKey || !fromEmail || !notificationEmail) return false

  const itemDetails = items
    .map(({ id, qty }) => `${id.replaceAll('-', ' ')} × ${qty}`)
    .join('\n')
  const paymentMode = paymentStatus === 'paid' ? 'online' : paymentStatus === 'advance-paid' ? 'advance' : 'after-service'
  const discounts = calculateBookingDiscounts(items, paymentMode)
  const amount = calculateBookingTotal(items, paymentMode)
  const paymentLabel = paymentStatus === 'paid' ? 'Paid online' : paymentStatus === 'advance-paid' ? '15% advance paid; balance due after service' : 'Due after service'

  const serviceLines = [
    `Booking ID: ${bookingId}`,
    '',
    `Name: ${customer.name}`,
    `Email: ${customer.email || 'Not provided'}`,
    `Phone: ${customer.phone}`,
    `Service address: ${customer.address}`,
    `Area: ${customer.area}`,
    `PIN code: ${customer.pincode}`,
    `Preferred date: ${customer.preferredDate}`,
    `Preferred time: ${customer.timeSlot}`,
    `Access notes: ${customer.notes || 'None'}`,
    '',
    'Booking items:',
    itemDetails,
    '',
    `Subtotal: ₹${discounts.subtotal.toLocaleString('en-IN')}`,
    ...(discounts.volumeAmount > 0 ? [`Multi-tank discount (${discounts.volumePercent}%): −₹${discounts.volumeAmount.toLocaleString('en-IN')}`] : []),
    ...(discounts.onlineAmount > 0 ? [`Online payment discount (${discounts.onlinePercent}%): −₹${discounts.onlineAmount.toLocaleString('en-IN')}`] : []),
    ...(discounts.advanceAmount > 0 ? [`Advance payment discount (${discounts.advancePercent}%): −₹${discounts.advanceAmount.toLocaleString('en-IN')}`] : []),
    `Order total after discounts: ₹${amount.toLocaleString('en-IN')}`,
    ...(paymentStatus === 'advance-paid' ? [`Advance paid now: ₹${discounts.paymentAmount.toLocaleString('en-IN')}`, `Balance due after service: ₹${discounts.balanceAmount.toLocaleString('en-IN')}`] : []),
    `Payment: ${paymentLabel}`,
    ...(paymentId ? [`Razorpay payment ID: ${paymentId}`] : []),
  ]

  const ownerText = [
    paymentStatus === 'paid' ? 'A tank cleaning booking has been paid online.' : paymentStatus === 'advance-paid' ? 'A 15% advance payment has been received; the remaining balance is due after service.' : 'A tank cleaning booking is due for payment after service.',
    ...serviceLines,
  ].join('\n')

  const ownerEmail = sendEmail(apiKey, idempotencyKey, {
    from: fromEmail,
    to: [notificationEmail],
    subject: paymentStatus === 'paid' ? `Booking ${bookingId} — paid tank cleaning` : `Booking ${bookingId} — payment due after service`,
    text: ownerText,
    ...(customer.email ? { reply_to: customer.email } : {}),
  })

  const customerEmail = customer.email
    ? sendEmail(apiKey, `${idempotencyKey}-customer`, {
        from: fromEmail,
        to: [customer.email],
        reply_to: notificationEmail,
        subject: `Your tank cleaning booking is confirmed — ${bookingId}`,
        text: [
          `Hi ${customer.name},`,
          '',
          'Thank you for booking with us. We have received your tank cleaning request and our team will contact you on your phone number to confirm the visit.',
          '',
          ...serviceLines,
          '',
          'Need to change anything? Simply reply to this email.',
        ].join('\n'),
      })
    : Promise.resolve(true)

  const [ownerSent] = await Promise.all([ownerEmail, customerEmail])
  return ownerSent
}
