import express from 'express'
import * as voteController from '../controllers/vote.controller'
// Middlewares
import isAdmin from '../middlewares/isAdmin'
import voteCanBeAccessed from '../middlewares/voteCanBeAccessed'
// Validators
import VoteStore from '../middlewares/validators/vote.store'

const router = express.Router()

router.delete('/delete/:id', isAdmin(true), voteController.remove)
router.post('/update/:id', isAdmin(true), VoteStore, voteController.update)
router.post('/create', isAdmin(true), VoteStore, voteController.create)
router.get('/index', voteController.index)
router.get('/:id', isAdmin(false), voteCanBeAccessed, voteController.single)

export default router
