// 'npm run dev' to start development server

import express from 'express'
import morgan from 'morgan' // logs request on the terminal (example: Get /users 100ms 200)
import path from 'path'

import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()

// HANDLERS
import {
  createUser,
  resendVerificationEmail,
  authenticateUser,
  verifyToken,
  verifyEmail,
  sendPasswordResetCode,
  resetPassword,
  getUsers,
  getUser,
  getWishlist,
  getCollection,
  updateUser,
  updateLists,
  deleteUser,
} from './controllers/UserController'

import {
  createPlant,
  getPlants,
  getPlantsToReview,
  getPlant,
  getSimilarPlants,
  getRandomPlants,
  // getUserPlants,
  getUserContributions,
  // addComment,
  updatePlant,
  deletePlant,
} from './controllers/PlantController'

import {
  createSuggestion,
  getSuggestions,
  getSuggestionsBySlug,
  updateSuggestion,
} from './controllers/SuggestionController'

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
  // users
  .post(`${API_URL}/users`, createUser)
  .post(`${API_URL}/verification-email/:userId`, resendVerificationEmail)
  .post(`${API_URL}/login`, authenticateUser)
  .post(`${API_URL}/token`, verifyToken)
  .post(`${API_URL}/verify-email/:code`, verifyEmail)
  .post(`${API_URL}/password-reset-code`, sendPasswordResetCode)
  .post(`${API_URL}/password`, resetPassword)
  .get(`${API_URL}/users`, getUsers)
  .get(`${API_URL}/users/:id`, getUser)
  .get(`${API_URL}/wishlist/:userId`, getWishlist)
  .get(`${API_URL}/collection/:userId`, getCollection)
  .put(`${API_URL}/users/:id`, updateUser)
  .post(`${API_URL}/lists/:userId`, updateLists)
  .delete(`${API_URL}/users/:id`, deleteUser)

  // plants
  .post(`${API_URL}/plants`, createPlant)
  .get(`${API_URL}/plants/:page`, getPlants)
  .get(`${API_URL}/plants-to-review`, getPlantsToReview)
  .get(`${API_URL}/plant/:slug`, getPlant)
  .get(`${API_URL}/similar-plants/:slug`, getSimilarPlants)
  .get(`${API_URL}/random-plants`, getRandomPlants)
  // .get(`${API_URL}/user-plants/:page`, getUserPlants)
  .get(`${API_URL}/contributions/:userId`, getUserContributions)
  .put(`${API_URL}/plants/:id`, updatePlant)
  // .put(`${API_URL}/plants/:id/comments`, addComment)
  .delete(`${API_URL}/plants/:id`, deletePlant)

  // suggestions
  .post(`${API_URL}/suggestions/:plantId`, createSuggestion)
  .get(`${API_URL}/suggestions`, getSuggestions)
  .get(`${API_URL}/suggestions/:slug`, getSuggestionsBySlug)
  .put(`${API_URL}/suggestions/:id`, updateSuggestion)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend', 'build')))
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'))
})

app.listen(PORT, () => console.info(`Listening on port ${PORT}`))
