import Vote from '../models/Vote'

export default async function (req, res, next) {
  try {
    const vote = await Vote.findOne({ _id: req.params.id })

    if (vote.max_votes >= req.body.candidates.length) {
      return next()
    }

    return res.status(422).json({
      message: 'Number of selected candidates should not exceed the maximal number of allowed votes.',
      i18n_message: 'vote:max_number_of_votes_exceeded',
      status: 'error'
    })
  } catch (error) {
    next(error)
  }
}