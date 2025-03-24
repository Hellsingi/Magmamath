import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

app.get('/health', (_, res) => res.send('OK'))

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB connection error:', err))
