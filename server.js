// 'npm run dev' to start development server

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
  getSimilarPlants,
  getRandomPlants,
  getUserPlants,
  getUserContributions,
  addComment,
  updatePlant,
  deletePlant,
  getSearchTerms,
  getFilterValues,
} = require('./handlers/plantHandlers.js')

const {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
} = require('./handlers/suggestionHandlers.js')

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
  // TODO: change all '_id' to 'id'
  // users
  .post(`${API_URL}/users`, createUser)
  .post(`${API_URL}/login`, authenticateUser)
  .post(`${API_URL}/token`, verifyToken)
  .get(`${API_URL}/users`, getUsers)
  .get(`${API_URL}/users/:id`, getUser)
  .put(`${API_URL}/users/:id`, updateUser)
  .put(`${API_URL}/:username/add`, addToUser)
  .put(`${API_URL}/:username/remove`, removeFromUser)
  .delete(`${API_URL}/users/:_id`, deleteUser)

  // plants
  .post(`${API_URL}/plants`, createPlant)
  .get(`${API_URL}/plants/:page`, getPlants)
  .get(`${API_URL}/plants-to-review`, getPlantsToReview)
  .get(`${API_URL}/plant/:slug`, getPlant)
  .get(`${API_URL}/similar-plants/:slug`, getSimilarPlants)
  .get(`${API_URL}/random-plants`, getRandomPlants)
  .get(`${API_URL}/user-plants/:page`, getUserPlants)
  .get(`${API_URL}/contributions/:userId`, getUserContributions)
  .put(`${API_URL}/plants/:id`, updatePlant)
  .put(`${API_URL}/plants/:_id/comments`, addComment)
  .delete(`${API_URL}/plants/:_id`, deletePlant)
  .get(`${API_URL}/search-terms`, getSearchTerms)
  .get(`${API_URL}/filter-values`, getFilterValues)

  // suggestions
  .post(`${API_URL}/suggestions/:plantId`, createSuggestion)
  .get(`${API_URL}/suggestions/:slug`, getSuggestions)
  .put(`${API_URL}/suggestions/:id`, updateSuggestion)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')))
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

app.listen(PORT, () => console.info(`Listening on port ${PORT}`))
