import express from 'express'
import * as voterController from '../controllers/voter.controller'
// Middlewares
import isStudent from '../middlewares/isStudent'
import isAdmin from '../middlewares/isAdmin'
import agreesWithConditions from '../middlewares/agreesWithConditions'
import voteContainRightAmountOfVotes from '../middlewares/voteContainRightAmountOfVotes'
import votingIsClosed from '../middlewares/votingIsClosed'

const router = express.Router()

router.post('/vote/:id', isStudent, agreesWithConditions, voteContainRightAmountOfVotes, voterController.isVoting)
router.get('/index/:id', isAdmin(true), votingIsClosed, voterController.index)
router.get('/', isStudent, voterController.usersVotings)

export default router
