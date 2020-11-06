import express from 'express'
import * as candidateController from '../controllers/candidate.controller'
// Middlewares
import isStudent from '../middlewares/isStudent'
import isAdmin from '../middlewares/isAdmin'
import voteCanBeModified from '../middlewares/voteCanBeModified'
// Validators
import storeRequest from '../middlewares/validators/candidate.store'
import deleteRequest from '../middlewares/validators/candidate.delete'


const router = express.Router()

router.post('/store', voteCanBeModified, storeRequest, candidateController.store)
router.delete('/remove', isAdmin, deleteRequest, candidateController.remove)
router.get('/', isStudent, isAdmin, candidateController.index)

export default router
