import express from 'express'
import cors from 'cors'

import healthRoutes from './routes/healthRoutes.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import statisticsRoutes from './routes/statisticsRoutes.js'
import supplyChainRoutes from './routes/supplyChainRoutes.js'

// TransitOps Phase 1 Routes
import authRoutes from './routes/authRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import maintenanceRoutes from './routes/maintenanceRoutes.js'
import fuelExpenseRoutes from './routes/fuelExpenseRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

import { errorHandler, notFoundHandler } from './middleware/errorHandlers.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(healthRoutes)

// Legacy SmartLogistics routes (preserved)
app.use('/api', shipmentRoutes)
app.use('/api', eventRoutes)
app.use('/api', statisticsRoutes)
app.use(supplyChainRoutes)

// TransitOps Phase 1 Fleet & Operations Routes
app.use('/api', authRoutes)
app.use('/api', vehicleRoutes)
app.use('/api', driverRoutes)
app.use('/api', tripRoutes)
app.use('/api', maintenanceRoutes)
app.use('/api', fuelExpenseRoutes)
app.use('/api', analyticsRoutes)

app.use(errorHandler)
app.use(notFoundHandler)

export default app
