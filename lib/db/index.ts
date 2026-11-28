import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as typeof globalThis & { bookingPool?: Pool }

export function getDb() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is required to save service bookings.')

  const pool = globalForDb.bookingPool ?? new Pool({ connectionString })
  if (process.env.NODE_ENV !== 'production') globalForDb.bookingPool = pool

  return drizzle(pool, { schema })
}
