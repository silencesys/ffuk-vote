import express from 'express'
// Routes
import studentRoutes from './routes/student.routes'
import candidateRoutes from './routes/candidate.routes'
import voterRoutes from './routes/voter.routes'
import userRoutes from './routes/user.routes'
import voteRoutes from './routes/vote.routes'
import authRoutes from './routes/auth.routes'
import settingsRoutes from './routes/settings.routes'
// Middlewares
import userRegistrations from './middlewares/userRegistrations'
import isAuth from './middlewares/isAuth'

const router = express.Router()

router.use('/student', isAuth, userRegistrations('disabled'), studentRoutes)
router.use('/candidate', isAuth, userRegistrations('disabled'), candidateRoutes)
router.use('/voter', isAuth, userRegistrations('disabled'), voterRoutes)
router.use('/vote', isAuth, userRegistrations('disabled'), voteRoutes)
router.use('/settings', settingsRoutes)
router.use('/user', userRoutes)
router.use(authRoutes)
router.get('/info', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  })
})

export default router
