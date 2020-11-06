import express from 'express'
import * as voteController from '../controllers/vote.controller'
// Middlewares
import isAdmin from '../middlewares/isAdmin'
import voteCanBeAccessed from '../middlewares/voteCanBeAccessed'
// Validators
import VoteStore from '../middlewares/validators/vote.store'

const router = express.Router()

router.get('/index', voteController.index)
router.post('/create', isAdmin, VoteStore, voteController.create)
router.get('/:id', isAdmin(false), voteCanBeAccessed, voteController.single)

export default router
