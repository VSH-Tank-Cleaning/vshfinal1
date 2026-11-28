import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const serviceBookings = pgTable('service_bookings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  items: jsonb('items').notNull(),
  customer: jsonb('customer').notNull(),
  paymentStatus: text('payment_status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
