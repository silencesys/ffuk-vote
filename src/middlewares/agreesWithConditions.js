import Vote from '../models/Vote'

export default async function (req, res, next) {
  try {
    const vote = await Vote.findOne({ _id: req.params.id })

    if (
      vote.condition_url !== undefined &&
      vote.condition_url !== null &&
      vote.condition_url.length > 0 &&
      req.body.accepted_conditions
    ) {
      return next()
    } else if (vote.condition_url === null) {
      return next()
    } else {
      return res.status(422).json({
        message: 'It is required to accept the conditions.',
        i18n_message: 'voting:conditiong_agreement_missing',
        status: 'error'
      })
    }
  } catch (error) {
    next(error)
  }
}
