import Vote from '../models/Vote'
import validator from 'express-validator'

const { validationResult } = validator

export function create (req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Form validation failed.',
      i18n_message: 'vote:validation_error',
      errors: errors.array(),
      status: 'error'
    })
  }

  try {
    const vote = new Vote({
      name: req.body.name,
      max_votes: req.body.max_votes,
      from: req.body.date_from,
      to: req.body.date_to
    })
    vote.save()

    return res.json({
      message: 'Vote successfuly created!',
      i18n_message: 'vote:store_success',
      vote: vote,
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}

export async function index (req, res, next) {
  try {
    const votes = await Vote.find({})
      .sort({ date_to: 'asc' })

    return res.json(votes)
  } catch (error) {
    next(error)
  }
}