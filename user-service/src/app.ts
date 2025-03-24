import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/user.routes'
import { connectRabbitMQ } from './services/rabbitmq.service'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.get('/health', (_, res) => res.send('User Service OK'))

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log('✅ Connected to MongoDB')

    await connectRabbitMQ()

    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 User service running on port ${process.env.PORT}`)
    )
  } catch (err) {
    console.error('❌ Error starting app:', err)
  }
}

start()
