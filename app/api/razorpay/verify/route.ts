import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { sendBookingNotification } from '@/lib/booking-notification'
import { calculateBookingDiscounts, generateBookingId, parseBookingItems, parseCustomerDetails, razorpayAuthorization } from '@/lib/razorpay'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Payment verification is temporarily unavailable.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const items = parseBookingItems(body?.items)
  const paymentMode = body?.paymentMode
  const orderId = typeof body?.orderId === 'string' ? body.orderId : ''
  const paymentId = typeof body?.paymentId === 'string' ? body.paymentId : ''
  const signature = typeof body?.signature === 'string' ? body.signature : ''
  if (!items || (paymentMode !== 'online' && paymentMode !== 'advance') || !/^order_[A-Za-z0-9]+$/.test(orderId) || !/^pay_[A-Za-z0-9]+$/.test(paymentId) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return NextResponse.json({ error: 'The payment details could not be verified.' }, { status: 400 })
  }

  const expectedSignature = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest()
  const receivedSignature = Buffer.from(signature, 'hex')
  if (expectedSignature.length !== receivedSignature.length || !timingSafeEqual(expectedSignature, receivedSignature)) {
    return NextResponse.json({ error: 'The payment signature is invalid.' }, { status: 400 })
  }

  const discounts = calculateBookingDiscounts(items, paymentMode)
  const expectedAmount = discounts.paymentAmount * 100
  const authorization = razorpayAuthorization(keyId, keySecret)

  try {
    const [orderResponse, paymentResponse] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
        headers: { Authorization: authorization },
        cache: 'no-store',
        signal: AbortSignal.timeout(12000),
      }),
      fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: { Authorization: authorization },
        cache: 'no-store',
        signal: AbortSignal.timeout(12000),
      }),
    ])

    if (!orderResponse.ok || !paymentResponse.ok) {
      return NextResponse.json({ error: 'Razorpay could not confirm this payment. Please contact our team with your payment ID.' }, { status: 502 })
    }

    const [order, payment] = await Promise.all([orderResponse.json(), paymentResponse.json()])
    const orderNotes = order.notes && typeof order.notes === 'object'
      ? order.notes as Record<string, unknown>
      : {}
    const validPayment = order.id === orderId
      && order.amount === expectedAmount
      && order.currency === 'INR'
      && orderNotes.payment_mode === paymentMode
      && orderNotes.booking_total === String(discounts.total)
      && orderNotes.payment_amount === String(discounts.paymentAmount)
      && orderNotes.balance_amount === String(discounts.balanceAmount)
      && payment.id === paymentId
      && payment.order_id === orderId
      && payment.amount === expectedAmount
      && payment.currency === 'INR'
      && payment.status === 'captured'

    if (!validPayment) {
      return NextResponse.json({ error: 'Razorpay has not confirmed a captured payment. Please contact our team with your payment ID.' }, { status: 400 })
    }

    const customer = parseCustomerDetails({
      name: orderNotes.customer_name,
      email: orderNotes.customer_email,
      phone: orderNotes.customer_phone,
      address: orderNotes.service_address,
      area: orderNotes.service_area,
      pincode: orderNotes.pincode,
      preferredDate: orderNotes.preferred_date,
      timeSlot: orderNotes.preferred_time_slot,
      notes: orderNotes.customer_notes === 'None' ? '' : orderNotes.customer_notes,
    })
    const bookingId = generateBookingId(paymentId)
    const notificationSent = customer
      ? await sendBookingNotification({
        customer,
        items,
        paymentStatus: paymentMode === 'advance' ? 'advance-paid' : 'paid',
        bookingId,
        paymentId,
        idempotencyKey: `booking-notification-${paymentId}`,
      })
      : false

    return NextResponse.json({ verified: true, bookingId, mode: paymentMode, notificationSent })
  } catch {
    return NextResponse.json({ error: 'Unable to confirm payment with Razorpay. Please contact our team with your payment ID.' }, { status: 502 })
  }
}
