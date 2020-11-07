import User from '../models/User'
import validator from 'express-validator'

const { validationResult } = validator

export async function register (req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Form validation failed.',
      i18n_message: 'user:validation_error',
      errors: errors.array(),
      status: 'error'
    })
  }

  try {
    const existingUser = await User.findOne({ oidos: req.body.oidos })

    if (existingUser) {
      return res.status(422).json({
        message: 'User with given ID already exists.',
        i18n_message: 'user:student_exists',
        status: 'error'
      })
    }

      const user = new User({
        name: req.body.name,
        oidos: req.body.oidos,
        role: req.body.role || 'user'
      })

      user.save()

      return res.json({
        message: 'User successfuly registered!',
        i18n_message: 'user:registration_success',
        user: user,
        status: 'success'
      })
  } catch (error) {
    next(error)
  }
}

export async function profile (req, res, next) {
  try {
    const user = await User.findOne({ oidos: req.authUser.oidos })

    return res.json({
      ...req.authUser,
      role: user ? user.role : 'user'
    })
  } catch (error) {
    next(error)
  }
}
