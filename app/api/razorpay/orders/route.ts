import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { calculateBookingTotal, parseBookingItems, parseCustomerDetails, razorpayAuthorization } from '@/lib/razorpay'

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
  if (!items || !customer) {
    return NextResponse.json({ error: 'Check your booking and customer details, then try again.' }, { status: 400 })
  }

  const amount = calculateBookingTotal(items, true) * 100
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
