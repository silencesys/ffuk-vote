import express from 'express'
// Routes
import studentRoutes from './routes/student.routes'
import candidateRoutes from './routes/candidate.routes'
import voterRoutes from './routes/voter.routes'
import userRoutes from './routes/user.routes'
import voteRoutes from './routes/vote.routes'
// Middlewares
import userRegistrations from './middlewares/userRegistrations'

const router = express.Router()

router.use('/student', userRegistrations('disabled'), studentRoutes)
router.use('/candidate', userRegistrations('disabled'), candidateRoutes)
router.use('/voter', userRegistrations('disabled'), voterRoutes)
router.use('/vote', voteRoutes)
router.use('/user', userRoutes)
router.get('/info', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  })
})

export default router
