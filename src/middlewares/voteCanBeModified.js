import Vote from '../models/Vote'

export default async function (req, res, next) {
  try {
    const voteId = req.params.id || req.body.vote_id
    const vote = await Vote.findOne({ _id: voteId })
    const today = new Date()
    const voteDate = new Date(vote.from)

    if (voteDate > today) {
      return next()
    } else {
      return res.status(422).json({
        message: 'Vote can not be modified after start.',
        i18n_message: 'vote:cant_be_modified_after_start',
        status: 'error'
      })
    }
  } catch (error) {
    next(error)
  }
}