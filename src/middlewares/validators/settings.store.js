import validator from 'express-validator'

const { body } = validator

export default [
  body('conditions')
    .not().isEmpty().withMessage('value_must_not_be_empty')
    .trim()
]
