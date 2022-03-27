// npm run dev to start development server

'use strict' // helps write more secure javascript

const express = require('express')
const morgan = require('morgan') // logs request on the terminal (example: Get /users 100ms 200)
const path = require('path')

// HANDLERS
const {
  createUser,
  authenticateUser,
  verifyToken,
  getUsers,
  getUser,
  addToUser,
  removeFromUser,
} = require('./handlers/userHandlers.js')
const {
  createPlant,
  getPlants,
  getPlant,
  addComment,
  updatePlant,
  deletePlant,
} = require('./handlers/plantHandlers.js')

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
  // FIXME: change /login endpoint to use noun instead of verb
  .post('/login', authenticateUser)
  .post('/token', verifyToken)
  .get('/users', getUsers)
  .get('/users/:_id', getUser)
  // FIXME: change /add and /remove endpoints to use nouns instead of verb (eg: /:username/collection ?) & update handler function(s)
  .put('/:username/add', addToUser)
  .put('/:username/remove', removeFromUser)
  .post('/plants', createPlant)
  .get('/plants/:page', getPlants)
  .get('/plants/:_id', getPlant)
  .put('plants/:_id', updatePlant)
  .put('/plants/:_id/comments', addComment)
  .delete('/plants/:_id', deletePlant)

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
