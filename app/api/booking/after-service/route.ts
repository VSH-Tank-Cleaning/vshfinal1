import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { serviceBookings } from '@/lib/db/schema'
import { sendBookingNotification } from '@/lib/booking-notification'
import { generateBookingId, parseBookingItems, parseCustomerDetails } from '@/lib/razorpay'


export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const items = parseBookingItems(body?.items)
  const customer = parseCustomerDetails(body?.customer)
  if (!items || !customer) {
    return NextResponse.json({ error: 'Please check your booking details and try again.' }, { status: 400 })
  }

  const bookingId = generateBookingId()

  try {
    await getDb().insert(serviceBookings).values({
      id: bookingId,
      userId: `guest:${bookingId}`,
      items,
      customer,
      paymentStatus: 'due-after-service',
    })
  } catch {
    return NextResponse.json({ error: 'We could not save your booking right now. Please call us on +91 95990 57079.' }, { status: 503 })
  }

  await sendBookingNotification({
    customer,
    items,
    paymentStatus: 'due-after-service',
    bookingId,
    idempotencyKey: `booking-after-service-${bookingId}`,
  })

  return NextResponse.json({ confirmed: true, bookingId })

}
