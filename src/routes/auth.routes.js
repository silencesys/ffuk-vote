import express from 'express'
import passport from '../services/passport'
import * as authController from '../controllers/authController'
import isAuth from '../middleware/isAuth'

const router = express.Router()

router.get('/login/cas', authController.authenticate)
router.get('/login/cas/authenticate',
  passport.authenticate('oauth2', { failureRedirect: '/login', session: false }),
  authController.loginUser
)
router.post('/logout', isAuth, authController.logoutUser)

export default router
