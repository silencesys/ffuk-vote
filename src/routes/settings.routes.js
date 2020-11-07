import express from 'express'
import * as settingsController from '../controllers/settings.controller'
// Middlewares
import isAdmin from '../middlewares/isAdmin'
import isAuth from '../middlewares/isAuth'
// Validators
import storeRequest from '../middlewares/validators/settings.store'

const router = express.Router()

router.post('/store', isAuth, isAdmin(true), storeRequest, settingsController.store)
router.get('/', settingsController.get)

export default router
