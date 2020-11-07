import Vote from '../models/Vote'
import * as voteUtils from '../utils/vote'

export default async function (req, res, next) {
  try {
    const vote = await Vote.findOne({ _id: req.params.id })

    if (voteUtils.dateIsBeforeToday(vote.to)) {
      return next()
    }

    return res.status(403).json({
      message: 'Vote can not be accessed before voting ends.',
      i18n_message: 'vote:cant_be_accessed_before_end',
      status: 'error'
    })
  } catch (error) {
    next(error)
  }
}