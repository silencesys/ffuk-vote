import express from 'express'
import * as voteController from '../controllers/vote.controller'
// Middlewares
import isAdmin from '../middlewares/isAdmin'
// Validators
import VoteStore from '../middlewares/validators/vote.store'

const router = express.Router()

router.post('/create', VoteStore, voteController.create)
router.get('/index', voteController.index)

export default router
