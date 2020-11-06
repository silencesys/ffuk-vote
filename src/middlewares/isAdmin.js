import User from '../models/User'

export default function (mustBeAdminToProceed = true) {
 return async function (req, res, next) {
    try {
      const user = await User.findOne({ oidos: req.authUser.oidos })

      if (user && user.role === 'admin') {
        req.authUser.isAdmin = user.role === 'admin'
        return next()
      }

      if (!mustBeAdminToProceed) {
        return next()
      }

      return res.status(403).json({
        message: `Not authorized.`,
        i18n_message: `authorization:user_not_authorized`,
        status: 'error'
      })
    } catch (error) {
      next(error)
    }
  }
}
