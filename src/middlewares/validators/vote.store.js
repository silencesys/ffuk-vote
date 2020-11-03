import validator from 'express-validator'

const { body } = validator

export default [
  body('name', 'Name of the vote must be set')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.')
    .trim(),
  body('date_from')
    .isAfter(Date()).withMessage('Date must be after this day.'),
  body('date_to')
    .isAfter(Date()).withMessage('Date must be after this day.'),
    body('max_votes')
      .isInt({ min: 1 }).withMessage('There must be at least 1 vote allowed.')
]
