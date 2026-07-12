import { transitopsStore } from '../utils/transitopsStore.js'
import { supabase, isNetworkError } from '../config/supabase.js'

export async function loginUser(req, res) {
  try {
    const { email, role } = req.body
    const user = transitopsStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) ||
                 transitopsStore.users.find(u => u.role === role) ||
                 transitopsStore.users[0]

    return res.json({
      success: true,
      token: `demo-jwt-token-for-${user.role.toLowerCase().replace(/ /g, '-')}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function getCurrentUser(req, res) {
  const role = req.headers['x-user-role'] || 'Fleet Manager'
  const user = transitopsStore.users.find(u => u.role === role) || transitopsStore.users[0]
  return res.json({ success: true, data: user })
}
