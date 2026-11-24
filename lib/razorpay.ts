import { isSupportedPincode } from './service-areas'

export type BookingItem = { id: string; qty: number }

export type CustomerDetails = {
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

export type BookingDiscounts = {
  subtotal: number
  tankCount: number
  volumePercent: number
  volumeAmount: number
  onlinePercent: number
  onlineAmount: number
  total: number
}

const timeSlots = ['8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM', '2:00 PM – 4:00 PM', '6:00 PM – 8:00 PM']

const overheadCapacities = [
  { id: 'up-to-500', label: 'Up to 500 L', price: 499 },
  { id: '501-1000', label: '501–1,000 L', price: 599 },
  { id: '1001-1500', label: '1,001–1,500 L', price: 749 },
  { id: '1501-2000', label: '1,501–2,000 L', price: 849 },
  { id: '2500-5000', label: '2,500–5,000 L', price: 1499 },
]
const undergroundCapacities = [
  { id: 'up-to-1500', label: 'Up to 1,500 L', price: 799 },
  { id: '1501-3000', label: '1,501–3,000 L', price: 1099 },
  { id: '3001-5000', label: '3,001–5,000 L', price: 1599 },
  { id: '5001-10000', label: '5,001–10,000 L', price: 2599 },
  { id: '10001-15000', label: '10,001–15,000 L', price: 2999 },
  { id: '15001-20000', label: '15,001–20,000 L', price: 3599 },
  { id: '20001-30000', label: '20,001–30,000 L', price: 3999 },
]

const additionalServices: Record<string, number> = {
  'cement-tank': 599,
  'rainwater-harvesting': 14999,
  'borewell-cleaning': 15000,
  'pipeline-cleaning': 1999,
  'tank-measurement': 99,
}

function getUnitPrice(id: string): number | null {
  if (Object.hasOwn(additionalServices, id)) return additionalServices[id]

  for (const capacity of overheadCapacities) {
    if (id === `overhead-${capacity.id}` || id === `overhead-${capacity.label}`) return capacity.price
  }
  for (const capacity of undergroundCapacities) {
    if (id === `underground-${capacity.id}` || id === `underground-${capacity.label}`) return capacity.price
  }

  return null
}

export function parseBookingItems(value: unknown): BookingItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) return null

  const items: BookingItem[] = []
  let totalQuantity = 0

  for (const entry of value) {
    if (!entry || typeof entry !== 'object') return null
    const { id, qty } = entry as Record<string, unknown>
    if (typeof id !== 'string' || id.length > 80 || getUnitPrice(id) === null) return null
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > 20) return null
    totalQuantity += qty
    if (totalQuantity > 100) return null
    items.push({ id, qty })
  }

  return items
}

export function calculateBookingDiscounts(items: BookingItem[], online = false): BookingDiscounts {
  const subtotal = items.reduce((total, item) => total + (getUnitPrice(item.id) ?? 0) * item.qty, 0)
  const tankItems = items.filter((item) => /^(overhead|underground)-/.test(item.id) || item.id === 'cement-tank')
  const tankSubtotal = tankItems.reduce((total, item) => total + (getUnitPrice(item.id) ?? 0) * item.qty, 0)
  const tankCount = tankItems.reduce((count, item) => count + item.qty, 0)
  const volumePercent = tankCount > 5 ? 15 : tankCount >= 3 ? 12 : tankCount === 2 ? 10 : 0
  const volumeAmount = Math.round(tankSubtotal * volumePercent / 100)
  const afterVolume = subtotal - volumeAmount
  const onlinePercent = online ? 10 : 0
  const onlineAmount = Math.round(afterVolume * onlinePercent / 100)

  return { subtotal, tankCount, volumePercent, volumeAmount, onlinePercent, onlineAmount, total: afterVolume - onlineAmount }
}

export function calculateBookingTotal(items: BookingItem[], online = false): number {
  return calculateBookingDiscounts(items, online).total
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length > 0 && text.length <= maxLength ? text : null
}

export function parseCustomerDetails(value: unknown): CustomerDetails | null {
  if (!value || typeof value !== 'object') return null
  const fields = value as Record<string, unknown>
  const name = cleanText(fields.name, 100)
  const phone = cleanText(fields.phone, 20)
  const email = cleanText(fields.email, 254)
  const address = cleanText(fields.address, 240)
  const area = cleanText(fields.area, 100)
  const pincode = cleanText(fields.pincode, 6)
  const preferredDate = cleanText(fields.preferredDate, 10)
  const timeSlot = cleanText(fields.timeSlot, 40)
  const notes = fields.notes === '' ? '' : cleanText(fields.notes, 200)

  if (!name || !phone || !email || !address || !area || !pincode || !preferredDate || !timeSlot || notes === null) return null
  if (name.length < 2 || address.length < 5 || area.length < 2) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return null
  if (!isSupportedPincode(pincode)) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return null
  const parsedDate = new Date(`${preferredDate}T00:00:00.000Z`)
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== preferredDate) return null
  if (preferredDate < new Date().toISOString().slice(0, 10) || !timeSlots.includes(timeSlot)) return null

  return { name, phone, email, address, area, pincode, preferredDate, timeSlot, notes }
}

export function razorpayAuthorization(keyId: string, keySecret: string): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}
