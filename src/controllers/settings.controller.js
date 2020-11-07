import Settings from '../models/Settings'
import validator from 'express-validator'

const { validationResult } = validator

export async function get (req, res, next) {
  const key = req.body.key || req.query.key
  try {
    const option = await Settings.findOne({ key: key })

    if (!option) {
      return res.status(404).json({
        message: 'Settings for given key was not found',
        i18n_message: 'settings:key_not_found',
        status: 'error'
      })
    }

    return res.json({
      option: option,
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}

export async function store (req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Form validation failed.',
      i18n_message: 'settings:validation_error',
      errors: errors.array(),
      status: 'error'
    })
  }

  try {
    let option = await Settings.findOne({ key: req.body.key })

    if (option) {
      option.value = req.body.value
      option.description = req.body.description

      option.save()
    } else {
      option = new Settings({
        key: req.body.key,
        value: req.body.value,
        description: req.body.description
      })

      option.save()
    }

    return res.json({
      message: 'Settings successfuly stored!',
      i18n_message: 'settings:store_success',
      option: option,
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}