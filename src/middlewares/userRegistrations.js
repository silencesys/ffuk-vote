import config from '../configs/app'

export default function (expectedState = 'disabled') {
  return async function (req, res, next) {
    if (expectedState === config.registrations) {
      return next()
    } else {
      return res.json({
        message: `Can not continue, registrations are ${config.registrations} and expected state is ${expectedState}.`,
        i18n_message: `error:registrations_${config.registrations}`,
        status: 'error'
      })
    }
  }
}
