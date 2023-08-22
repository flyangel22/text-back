// 引入必要的套件
import 'dotenv/config' // 使用dotenv套件，讓程式可以讀取環境變數
import express from 'express' // 使用Express框架來建立伺服器
import mongoose from 'mongoose' // 使用Mongoose套件來連接資料庫
import { StatusCodes } from 'http-status-codes' // 使用http-status-codes套件來使用HTTP狀態碼
import mongoSanitize from 'express-mongo-sanitize' // 過濾
import rateLimit from 'express-rate-limit' // 流量限制
import cors from 'cors'
import routeUsers from './routes/users.js'
import routeProducts from './routes/products.js'
import routeOrders from './routes/orders.js'
import './passport/passport.js'

const app = express()

app.use(rateLimit({
  // 設定一個 IP 在 15 分鐘內最多 100 次請求
  windowMs: 15 * 60 * 1000,
  max: 100,
  // 設定回應 headers
  standardHeaders: true,
  legacyHeaders: false,
  // 超出流量時回應的狀態碼
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  // 超出流量時回應的訊息
  message: '太多請求',
  // 超出流量時回應的 function
  handler(req, res, next, options) {
    res.status(options.statusCode).json({
      success: false,
      message: options.message
    })
  }
}))

app.use(cors({
  // origin = 請求來源
  // callback(錯誤, 是否允許請求)
  origin(origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))

app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: true,
    message: '請求被拒'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: true,
    message: '資料格式錯誤'
  })
})

app.use(mongoSanitize())

app.use('/users', routeUsers)
app.use('/products', routeProducts)
app.use('/orders', routeOrders)

app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
