import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  { timestamps: { createdAt: 'createdAt' } }
)

export const User = mongoose.model('User', userSchema)
