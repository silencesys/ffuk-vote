import validator from 'express-validator'

const { body } = validator

export default [
  body('key')
    .not().isEmpty().withMessage('key_must_not_be_empty')
    .trim(),
  body('value')
    .not().isEmpty().withMessage('value_must_not_be_empty')
    .trim()
]
