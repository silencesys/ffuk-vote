import express from 'express'
import * as candidateController from '../controllers/candidate.controller'
// Middlewares
import isStudent from '../middlewares/isStudent'
import isAdmin from '../middlewares/isAdmin'
// Validators
import storeRequest from '../middlewares/validators/candidate.store'
import deleteRequest from '../middlewares/validators/candidate.delete'


const router = express.Router()

router.post('/store', storeRequest, candidateController.store)
router.delete('/remove', deleteRequest, candidateController.remove)
router.get('/', isStudent, isAdmin, candidateController.index)

export default router
