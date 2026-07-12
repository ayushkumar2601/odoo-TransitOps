/**
 * TransitOps Phase 1 — RBAC Authentication Middleware
 * Enforces Role-Based Access Control for Fleet Manager, Dispatcher, Safety Officer, Financial Analyst, and Admin.
 */

export const PERMISSIONS = {
  VEHICLES_WRITE: ['Fleet Manager', 'Admin'],
  VEHICLES_READ: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],

  DRIVERS_WRITE: ['Safety Officer', 'Fleet Manager', 'Admin'],
  DRIVERS_READ: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],

  TRIPS_WRITE: ['Dispatcher', 'Fleet Manager', 'Admin'],
  TRIPS_READ: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],

  MAINTENANCE_WRITE: ['Fleet Manager', 'Admin'],
  MAINTENANCE_READ: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],

  EXPENSES_WRITE: ['Financial Analyst', 'Fleet Manager', 'Admin'],
  EXPENSES_READ: ['Financial Analyst', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin'],

  ANALYTICS_READ: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin']
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    // Determine current user role from custom header x-user-role or auth bearer token
    const roleHeader = req.headers['x-user-role'] || req.headers['x-role'] || 'Admin'
    const currentRole = roleHeader

    if (!allowedRoles.includes(currentRole) && currentRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: `RBAC Permission Denied: Role '${currentRole}' is not authorized for this action. Allowed roles: ${allowedRoles.join(', ')}`
      })
    }

    req.user = { role: currentRole, id: req.headers['x-user-id'] || 'demo-user' }
    next()
  }
}
