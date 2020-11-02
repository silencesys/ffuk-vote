import logger from '../utils/logger'

export default Object.freeze({
  get authorizationURL () {
    return this.oauthUrl('/authorize')
  },
  get tokenUrl () {
    return this.oauthUrl('/accessToken')
  },
  get profileUrl () {
    return this.oauthUrl('/profile')
  },
  get clientId () {
    const clientId = process.env.CAS_OAUTH_CLIENT_ID || 'placeholder-id'
    if (clientId === 'placeholder-id') {
      logger.error(new Error('Client ID must be set.').stack)
    }
    return clientId
  },
  get clientSecret () {
    const clientSecret = process.env.CAS_OAUTH_SECRET || 'placeholder-secret'
    if (clientSecret === 'placeholder-secret') {
      logger.error(new Error('Client secret must be set.').stack)
    }
    return clientSecret
  },
  oauthUrl (urlPath = '') {
    const oauthUrl = process.env.CAS_OAUTH_URL

    if (oauthUrl === undefined) {
      logger.error(new Error(
        'Can not read CAS_OAUTH_URL env variable, CAS URL must be specified.'
      ).stack)
    }

    return oauthUrl + urlPath
  }
})
