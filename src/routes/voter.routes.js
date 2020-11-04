import express from 'express'
import * as voterController from '../controllers/voter.controller'
// Middlewares
import isStudent from '../middlewares/isStudent'
import isAdmin from '../middlewares/isAdmin'
import agreesWithConditions from '../middlewares/agreesWithConditions'

const router = express.Router()

router.post('/vote/:id', isStudent, agreesWithConditions, voterController.isVoting)
router.get('/index', isAdmin, voterController.index)
router.get('/', isStudent, voterController.usersVotings)

export default router
