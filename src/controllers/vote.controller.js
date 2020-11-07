import Vote from '../models/Vote'
import validator from 'express-validator'
import * as voteUtils from '../utils/vote'

const { validationResult } = validator

/**
 * Store vote in database. As there can be as many votes as administrating user
 * wants, there are no additional validations except the required field
 * validation.
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {function} next
 */
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
      condition_url: req.body.condition_url,
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

/**
 * Get list of all votes that are in database. Because main purpose of this
 * application was to provide one or two votings per installation there is
 * no pagination in the API.
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {function} next
 */
export async function index (req, res, next) {
  try {
    const votes = await Vote.find({})
      .sort({ to: 'asc' })

    return res.json(votes)
  } catch (error) {
    next(error)
  }
}

/**
 * Get single vote details with candidates. Only administrators can see number
 * of votes that have each candidate, thus select is stored in constant and
 * additionaly modified.
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {function} next
 */
export async function single (req, res, next) {
  const select = ['name', 'web_url', 'oidos', 'type', 'description']

  try {
    const vote = await Vote.findOne({ _id: req.params.id })

    if (
      req.authUser !== undefined &&
      req.authUser.isAdmin &&
      voteUtils.dateIsBeforeToday(vote.to)
    ) {
      // Append to selection vote
      select.push('votes')
    }

    await vote.populate('candidates', select, null, { sort: { surname: 'asc' }})
      .execPopulate()

    return res.json({
      vote: vote
    })
  } catch (error) {
    next(error)
  }
}
