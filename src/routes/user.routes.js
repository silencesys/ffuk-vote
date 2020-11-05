import express from 'express'
import * as userController from '../controllers/user.controller'
// Middlewares
import userRegistration from '../middlewares/userRegistrations'
import isAuth from '../middlewares/isAuth'
// Validators
import userStore from '../middlewares/validators/user.store'

const router = express.Router()

router.post('/register', userRegistration('enabled'), userStore, userController.register)
router.post('/profile', isAuth, userController.profile)

export default router
