import mongoose, { Schema } from 'mongoose'
const eventsSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    session: { type: String, required: true },
    action: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
)
eventsSchema.index(
  { post: 1, session: 1 },
  {
    unique: true,
    partialFilterExpression: { action: 'likes' },
  },
)
export const Event = mongoose.model('events', eventsSchema)
