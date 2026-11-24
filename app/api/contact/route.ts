import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function textField(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 && normalized.length <= maxLength ? normalized : null
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 12_000) {
    return NextResponse.json({ error: 'The message is too long.' }, { status: 413 })
  }

  const rawBody = await request.text().catch(() => null)
  if (rawBody === null) {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
  }
  if (rawBody.length > 12_000) {
    return NextResponse.json({ error: 'The message is too long.' }, { status: 413 })
  }

  let body: Record<string, unknown> | null = null
  try {
    const parsed: unknown = JSON.parse(rawBody || 'null')
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>
    }
  } catch {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
  }
  if (!body) {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
  }

  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ sent: true })
  }

  const name = textField(body.name, 100)
  const email = textField(body.email, 254)
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const remarks = textField(body.remarks, 2000)

  if (!name || name.length < 2 || !email || !emailPattern.test(email) || !remarks || remarks.length < 5) {
    return NextResponse.json({ error: 'Please check your name, email, and message, then try again.' }, { status: 400 })
  }
  if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    return NextResponse.json({ error: 'Enter a 10-digit phone number, or leave the field empty.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL
  if (!apiKey || !fromEmail || !notificationEmail) {
    return NextResponse.json({ error: 'Email delivery is temporarily unavailable.' }, { status: 503 })
  }

  const emailText = [
    'A visitor sent a question from the VSH Tank Cleaning website.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    '',
    'Remarks or questions:',
    remarks,
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact-${randomUUID()}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notificationEmail],
        reply_to: email,
        subject: 'New website question for VSH Tank Cleaning',
        text: emailText,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'We couldn’t send your message. Please try again.' }, { status: 502 })
    }
    return NextResponse.json({ sent: true })
  } catch {
    return NextResponse.json({ error: 'We couldn’t send your message. Please try again.' }, { status: 502 })
  }
}
