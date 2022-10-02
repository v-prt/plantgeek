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
  updateUser,
  addToUser,
  removeFromUser,
  deleteUser,
} = require('./handlers/userHandlers.js')
const {
  createPlant,
  getPlants,
  getPlantsToReview,
  getPlant,
  getRandomPlants,
  getUserPlants,
  getUserContributions,
  addComment,
  updatePlant,
  uploadToCloudinary,
  deletePlant,
} = require('./handlers/plantHandlers.js')

// run on whatever port heroku has available or 4000 (local)
const PORT = process.env.PORT || 4000
const API_URL = process.env.API_URL

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
  .post(`${API_URL}/users`, createUser)
  // FIXME: change /login endpoint to use noun instead of verb
  .post(`${API_URL}/login`, authenticateUser)
  .post(`${API_URL}/token`, verifyToken)
  .get(`${API_URL}/users`, getUsers)
  .get(`${API_URL}/users/:id`, getUser)
  // FIXME: change /add and /remove endpoints to use nouns instead of verb (eg: /:username/collection ?) & update handler function(s)
  .put(`${API_URL}/users/:id`, updateUser)
  .put(`${API_URL}/:username/add`, addToUser)
  .put(`${API_URL}/:username/remove`, removeFromUser)
  .delete(`${API_URL}/users/:_id`, deleteUser)
  .post(`${API_URL}/plants`, createPlant)
  .get(`${API_URL}/plants/:page`, getPlants)
  .get(`${API_URL}/plants-to-review`, getPlantsToReview)
  .get(`${API_URL}/plant/:_id`, getPlant)
  .get(`${API_URL}/random-plants`, getRandomPlants)
  .get(`${API_URL}/user-plants/:page`, getUserPlants)
  .get(`${API_URL}/contributions/:userId`, getUserContributions)
  .put(`${API_URL}/plants/:_id`, updatePlant)
  .put(`${API_URL}/plants/:_id/comments`, addComment)
  .post(`${API_URL}/cloud-upload`, uploadToCloudinary)
  .delete(`${API_URL}/plants/:_id`, deletePlant)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')))
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

app.listen(PORT, () => console.info(`Listening on port ${PORT}`))
