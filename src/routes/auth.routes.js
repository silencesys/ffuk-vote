import express from 'express'
import passport from '../services/passport'
import * as authController from '../controllers/auth.controller'
import isAuth from '../middlewares/isAuth'

const router = express.Router()

router.get('/login/cas', authController.authenticate)
router.get('/login/cas/authenticate',
  passport.authenticate('oauth2', { failureRedirect: '/login', session: false }),
  authController.loginUser
)
router.post('/logout', isAuth, authController.logoutUser)

export default router
