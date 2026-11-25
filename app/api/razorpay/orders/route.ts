import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { calculateBookingDiscounts, parseBookingItems, parseCustomerDetails, razorpayAuthorization } from '@/lib/razorpay'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Payment setup is temporarily unavailable.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const items = parseBookingItems(body?.items)
  const customer = parseCustomerDetails(body?.customer)
  const paymentMode = body?.paymentMode
  if (!items || !customer || (paymentMode !== 'online' && paymentMode !== 'advance')) {
    return NextResponse.json({ error: 'Check your booking, payment option, and customer details, then try again.' }, { status: 400 })
  }

  const discounts = calculateBookingDiscounts(items, paymentMode)
  const amount = discounts.paymentAmount * 100
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: 'The booking total is invalid.' }, { status: 400 })
  }

  const notes = {
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    service_address: customer.address,
    service_area: customer.area,
    pincode: customer.pincode,
    preferred_date: customer.preferredDate,
    preferred_time_slot: customer.timeSlot,
    customer_notes: customer.notes || 'None',
    payment_mode: paymentMode,
    booking_total: String(discounts.total),
    payment_amount: String(discounts.paymentAmount),
    balance_amount: String(discounts.balanceAmount),
  }

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthorization(keyId, keySecret),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `vsh_${randomUUID()}`,
        notes,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })

    const order = await response.json().catch(() => null)
    if (!response.ok || typeof order?.id !== 'string') {
      return NextResponse.json({ error: 'Razorpay could not start checkout. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ orderId: order.id, amount, currency: 'INR', keyId })
  } catch {
    return NextResponse.json({ error: 'Unable to connect to Razorpay. Please try again.' }, { status: 502 })
  }
}
