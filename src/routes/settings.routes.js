import express from 'express'
import * as settingsController from '../controllers/settings.controller'
// Middlewares
import isAdmin from '../middlewares/isAdmin'
import isAuth from '../middlewares/isAuth'

const router = express.Router()

router.post('/save', isAuth, isAdmin(true), settingsController.store)
router.get('/all', settingsController.all)
router.get('/', settingsController.get)

export default router
