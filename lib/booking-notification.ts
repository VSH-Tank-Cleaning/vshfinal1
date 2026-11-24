import type { BookingItem, CustomerDetails } from '@/lib/razorpay'
import { calculateBookingDiscounts, calculateBookingTotal } from '@/lib/razorpay'

type BookingPaymentStatus = 'paid' | 'due-after-service'

type BookingNotification = {
  customer: CustomerDetails
  items: BookingItem[]
  paymentStatus: BookingPaymentStatus
  bookingId: string
  paymentId?: string
  idempotencyKey: string
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
  const discounts = calculateBookingDiscounts(items, paymentStatus === 'paid')
  const amount = calculateBookingTotal(items, paymentStatus === 'paid')
  const emailText = [
    paymentStatus === 'paid' ? 'A tank cleaning booking has been paid online.' : 'A tank cleaning booking is due for payment after service.',
    `Booking ID: ${bookingId}`,
    '',
    `Customer: ${customer.name}`,
    `Customer email: ${customer.email || 'Not provided'}`,
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
    `Total: ₹${amount.toLocaleString('en-IN')}`,
    `Payment: ${paymentStatus === 'paid' ? 'Paid online' : 'Due after service'}`,
    ...(paymentId ? [`Razorpay payment ID: ${paymentId}`] : []),
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notificationEmail],
        subject: paymentStatus === 'paid' ? `Booking ${bookingId} — paid tank cleaning` : `Booking ${bookingId} — payment due after service`,
        text: emailText,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    return response.ok
  } catch {
    return false
  }
}
