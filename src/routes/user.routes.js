import express from 'express'
import * as userController from '../controllers/user.controller'
import userRegistration from '../middlewares/userRegistrations'
// Validators
import userStore from '../middlewares/validators/user.store'

const router = express.Router()

router.post('/register', userRegistration('enabled'), userStore, userController.register)

export default router
