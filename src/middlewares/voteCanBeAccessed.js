import Vote from '../models/Vote'

export default async function (req, res, next) {
  try {
    const voteId = req.params.id || req.body.vote_id
    const vote = await Vote.findOne({ _id: voteId })
    const today = new Date()
    const voteDate = new Date(vote.from)

    if (req.authUser.role === 'admin' || today >= voteDate) {
      return next()
    } else {
      return res.status(422).json({
        message: 'Vote can not be accessed before voting starts.',
        i18n_message: 'vote:cant_be_accessed_before_start',
        status: 'error'
      })
    }
  } catch (error) {
    next(error)
  }
}
