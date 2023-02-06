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
  getContributions,
  updatePlant,
  deletePlant,
} from './controllers/PlantController'

import {
  createReport,
  getReports,
  countPendingReports,
  updateReportStatus,
} from './controllers/ReportController'

import {
  createReminder,
  updateReminder,
  getPlantReminders,
  getAllReminders,
} from './controllers/ReminderController'

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
  .get(`${API_URL}/plants-to-review/:page`, getPlantsToReview)
  .get(`${API_URL}/pending-plants`, countPendingPlants)
  .get(`${API_URL}/plant/:slug`, getPlant)
  .get(`${API_URL}/similar-plants/:slug`, getSimilarPlants)
  .get(`${API_URL}/random-plants`, getRandomPlants)
  .get(`${API_URL}/contributions/:userId/:page`, getContributions)
  .put(`${API_URL}/plants/:id`, updatePlant)
  .delete(`${API_URL}/plants/:id`, deletePlant)

  // reports
  .post(`${API_URL}/reports/:plantId`, createReport)
  .get(`${API_URL}/reports/:page`, getReports)
  .get(`${API_URL}/pending-reports`, countPendingReports)
  .put(`${API_URL}/reports/:reportId`, updateReportStatus)

  // reminders
  .post(`${API_URL}/reminders`, createReminder)
  .put(`${API_URL}/reminders/:reminderId`, updateReminder)
  .get(`${API_URL}/plant-reminders/:plantId/:userId`, getPlantReminders)
  .get(`${API_URL}/reminders/:userId`, getAllReminders)

export default router
