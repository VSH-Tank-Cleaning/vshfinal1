import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { sendBookingNotification } from '@/lib/booking-notification'
import { parseBookingItems, parseCustomerDetails } from '@/lib/razorpay'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const items = parseBookingItems(body?.items)
  const customer = parseCustomerDetails(body?.customer)
  if (!items || !customer) {
    return NextResponse.json({ error: 'Please check your booking details and try again.' }, { status: 400 })
  }

  const notificationSent = await sendBookingNotification({
    customer,
    items,
    paymentStatus: 'due-after-service',
    idempotencyKey: `booking-after-service-${randomUUID()}`,
  })
  if (!notificationSent) {
    return NextResponse.json({ error: 'We could not save your booking right now. Please call us on +91 95990 57079.' }, { status: 503 })
  }

  return NextResponse.json({ confirmed: true })
}
