import express from 'express'
import * as studentController from '../controllers/student.controller'

const router = express.Router()

router.post('/find', studentController.search)

export default router
