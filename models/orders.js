import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少活動']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  date: {
    type: Date,
    default: Date.now
  },
  cart: {
    type: [cartSchema],
    default: [],
    validate: {
      validator(value) {
        return value.length > 0
      },
      message: '購物車不能為空'
    }
  },
  note: {
    type: String,
    default: ''
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
