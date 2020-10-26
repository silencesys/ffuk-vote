import express from 'express'
import studentRoutes from './routes/student.routes'

const router = express.Router()

router.use('/student', studentRoutes)
router.get('/info', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  })
})

export default router
