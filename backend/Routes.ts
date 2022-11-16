import { Router } from 'express'

// CONTROLLERS
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
  countPendingPlants,
  getPlant,
  getSimilarPlants,
  getRandomPlants,
  getUserContributions,
  updatePlant,
  deletePlant,
} from './controllers/PlantController'

import {
  createReport,
  getReports,
  getPlantReports,
  countPendingReports,
  updateReportStatus,
} from './controllers/ReportController'

const router: Router = Router()
const API_URL = process.env.API_URL

// ENDPOINTS
// users
router
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
  .get(`${API_URL}/pending-plants`, countPendingPlants)
  .get(`${API_URL}/plant/:slug`, getPlant)
  .get(`${API_URL}/similar-plants/:slug`, getSimilarPlants)
  .get(`${API_URL}/random-plants`, getRandomPlants)
  .get(`${API_URL}/contributions/:userId`, getUserContributions)
  .put(`${API_URL}/plants/:id`, updatePlant)
  .delete(`${API_URL}/plants/:id`, deletePlant)

  // reports
  .post(`${API_URL}/reports/:plantId`, createReport)
  .get(`${API_URL}/reports`, getReports)
  .get(`${API_URL}/reports/:plantId`, getPlantReports)
  .get(`${API_URL}/pending-reports`, countPendingReports)
  .put(`${API_URL}/reports/:reportId`, updateReportStatus)

export default router
