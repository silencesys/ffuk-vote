import User from '../models/User'

export default async function (req, res, next) {
  try {
    const user = await User.findOne({ oidos: req.user.oidos })

    if (user) {
      req.user.isAdmin = user.role === 'admin'
    }
  } catch (error) {
    next(error)
  }

  next()
}
