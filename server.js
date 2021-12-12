// npm run dev to start development server

'use strict' // helps write more secure javascript

const express = require('express')
const morgan = require('morgan') // logs request on the terminal (example: Get /users 100ms 200)
const path = require('path')

// HANDLERS
const {
  createUser,
  authenticateUser,
  getUserByUsername,
  getUsers,
  addToUser,
  removeFromUser,
} = require('./handlers/userHandlers')
const { createPlant, getPlants, getPlant, postComment } = require('./handlers/plantHandlers')

// run on whatever port heroku has available or 4000 (local)
const PORT = process.env.PORT || 4000

const app = express()

app
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  .use(morgan('tiny'))
  .use(express.json())

  // ENDPOINTS
  .post('/users', createUser)
  .post('/login', authenticateUser)
  .get('/users/:username', getUserByUsername)
  .get('/users', getUsers)
  .put('/:username/add', addToUser)
  .put('/:username/remove', removeFromUser)
  .post('/plants', createPlant)
  .get('/plants', getPlants)
  .get('/plants/:_id', getPlant)
  .put('/plants/:_id/comments', postComment)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')))
}

// CATCH-ALL ENDPOINT
// .get('*', (req, res) => {
//   res.status(404).json({
//     status: 404,
//     message: 'Oops, nothing here!',
//   })
// })

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

app.listen(PORT, () => console.info(`Listening on port ${PORT}`))
