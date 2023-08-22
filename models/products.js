import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  price: {
    type: Number,
    required: [true, '缺少費用'],
    min: [0, '價格太低']
  },
  date: {
    type: String,
    required: [true, '缺少日期']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  description: {
    type: String,
    required: [true, '缺少活動說明']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['工作坊', '展覽講座', '投稿活動'],
      message: '分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少上架狀態']
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
