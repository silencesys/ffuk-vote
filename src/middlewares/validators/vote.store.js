import validator from 'express-validator'

const { body } = validator

export default [
  body('name')
    .isLength({ min: 3 }).withMessage('name_3_char_long')
    .trim(),
  body('date_from')
    .isAfter(Date()).withMessage('date_start_after_today'),
  body('date_to')
    .isAfter(Date()).withMessage('date_end_after_tomorrow'),
    body('max_votes')
      .isInt({ min: 1 }).withMessage('one_vote_min')
]
