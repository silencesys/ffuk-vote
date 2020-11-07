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

router.post('/store', voteCanBeModified, isAdmin(true), storeRequest, candidateController.store)
router.delete('/remove', isAdmin(true), deleteRequest, candidateController.remove)
router.get('/', isStudent, isAdmin(true), candidateController.index)

export default router
