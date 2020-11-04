import validator from 'express-validator'

const { body } = validator

export default [
  body('oidos', 'oidos_must_be_set')
    .not().isEmpty()
    .trim(),
  body('web_url')
    .not().isEmpty()
    .isURL().withMessage('url_must_be_valid_link')
]
