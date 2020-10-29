import validator from 'express-validator'

const { body } = validator

export default [
  body('oidos', 'Student number must be set')
    .isLength({ min: 3 })
    .trim(),
  body('name', 'Student\'s name must be set')
    .isLength({ min: 2 })
    .trim()
]
