import express from 'express'
import * as studentController from '../controllers/student.controller'

const router = express.Router()

router.get('/find', studentController.search)

export default router
