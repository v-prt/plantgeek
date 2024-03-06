// 'npm run dev' to start development server

import express, { Express } from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan' // logs request on the terminal (example: Get /users 100ms 200)
import path from 'path'
import fs from 'fs'
import https from 'https'
import routes from './Routes'

import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()

// run on whatever port heroku has available or 4000 (local)
const PORT: string | number = process.env.PORT || 4000
const app: Express = express()

app
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  .use(morgan('tiny'))
  .use(express.json())
  .use(routes)

const uri: string = `${process.env.MONGO_URI}`

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend', 'dist')))
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
})

// app.listen(PORT, () => console.info(`Listening on port ${PORT}`))

const key = fs.readFileSync(path.join(__dirname, '../cf_key.pem'))
const cert = fs.readFileSync(path.join(__dirname, '../cf_cert.pem'))

const server = https.createServer({ key, cert }, app)

mongoose
  .connect(uri)
  .then(() => server.listen(PORT, () => console.info(`Listening on port ${PORT}`)))
  .catch(error => console.error(error))

// Mongoose.connection.close now returns a promise, instead of accepting a callback arg
process.on('SIGINT', () => {
  mongoose.connection.close(true).then(() => {
    console.info('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})
