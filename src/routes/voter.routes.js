import express from 'express'
import * as voterController from '../controllers/voter.controller'
import isAdmin from '../middlewares/isAdmin'
// Middlewares
import isStudent from '../middlewares/isStudent'

const router = express.Router()

router.post('/vote', isStudent, voterController.isVoting)
router.get('/index', isAdmin, voterController.index)

export default router
