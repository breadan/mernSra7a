import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import xss from 'xss-clean'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import userRouter from './src/modules/user/user.routes.js'
import './database/dbConnection/connection.js'

import messageRouter from './src/modules/message/message.routes.js'
import { AppError, errorHandler } from './utils/appError.js'

const app = express()

// set up logger
app.use(morgan('tiny'))

// Set secruity headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// parse json request body
app.use(express.json())

// sanitize request data
app.use(xss())
app.use(mongoSanitize())

// Cors
app.use(cors())
app.options('*', cors())

// gzip compression
app.use(compression())

app.use('/public', express.static('upload')) // to get photo

app.use(userRouter)
app.use('/v1/messages', messageRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`This Resource Is Not Available ${req.originalUrl}`, 404))
})

app.use(errorHandler)

// test it
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json(err)
})

app.listen(5000, () => {
  console.log(`Example app listening on port ${5000}!`)
})
