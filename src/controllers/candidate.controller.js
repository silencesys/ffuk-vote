import Candidate from '../models/Candidate'
import Student from '../models/sis/Student'
import Vote from '../models/Vote'
import validator from 'express-validator'

const { validationResult } = validator

/**
 * Store student candidate in database
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 *
 * @return {Object<JSON>}
 */
export async function store (req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Form validation failed.',
      i18n_message: 'candidate:validation_error',
      errors: errors.array(),
      status: 'error'
    })
  }

  try {
    const student = await new Student({ SIDOS: req.body.oidos }).fetch()

    if (!student) {
      return res.status(422).json({
        message: 'Student with given ID was not found.',
        i18n_message: 'candidate:student_id_not_found',
        status: 'error'
      })
    }

    try {
      const existingCandidate = await Candidate.findOne({
         oidos: req.body.oidos,
         type: req.body.vote_id
      })

      if (existingCandidate) {
        return res.status(422).json({
          message: 'Student with given ID already exists.',
          i18n_message: 'candidate:student_already_exists',
          status: 'error'
        })
      }

      try {
        const vote = await Vote.findOne({ _id: req.body.vote_id })

        if (!vote) {
          return res.status(422).json({
            message: 'Vote with given ID does not exists.',
            i18n_message: 'candidate:vote_not_exists',
            status: 'error'
          })
        }

        const candidate = new Candidate({
          name: student.fullNameWithTitles,
          surname: student.attributes.SPRIJMENI,
          oidos: student.attributes.SIDOS,
          web_url: req.body.web_url,
          type: vote._id,
          description: req.body.description,
          votes: 0
        })

        candidate.save()

        vote.candidates.push(candidate._id)
        vote.save()

        return res.json({
          message: 'Candidate successfuly stored!',
          i18n_message: 'candidate:store_success',
          user: candidate,
          status: 'success'
        })
      } catch (error) {
        next(error)
      }
    } catch (error) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Delete candidate from database
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 *
 * @return {Object<JSON>}
 */
export async function remove (req, res, next) {
  try {
    const candidate = await Candidate.findOne({ oidos: req.body.oidos })

    if (!candidate) {
      return res.status(422).json({
        message: 'Candidate with given ID does not exists.',
        i18n_message: 'candidate:candidate_not_found',
        status: 'error'
      })
    }

    await Candidate.deleteOne({ oidos: req.body.oidos })
  } catch (error) {
    next(error)
  }

  res.json({
    message: 'Candidate deleted successfuly',
    i18n_message: 'candidate:deleted_success',
    status: 'success'
  })
}


/**
 * Get list of candidates
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 *
 * @return {Object<JSON>}
 */
export async function index (req, res, next) {
  const select = ['name', 'web_url', 'oidos', 'type']

  if (req.user.isAdmin) {
    select.push('votes')
  }

  try {
    const candidates = await Candidate.find({
      type: req.body.type || 'council'
    }, select).sort({ surname: 'asc' })

    return res.json(candidates)
  } catch (error) {
    next(error)
  }
}