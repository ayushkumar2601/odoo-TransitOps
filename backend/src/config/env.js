import dotenv from 'dotenv'
import path from 'path'

// Attempt to load from current working directory or backend/ directory
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') })

const { SUPABASE_URL, SUPABASE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[TransitOps Notice] Supabase credentials not found in environment; running in resilient offline fallback mode.')
}

export const PORT = process.env.PORT || 3001
export { SUPABASE_URL, SUPABASE_KEY }
