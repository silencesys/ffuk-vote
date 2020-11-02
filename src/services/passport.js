import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import config from '../configs/app'
import cas from '../configs/cas'
import { ProfileSerializer } from '../serializers/userProfile'

const oAuthStrategy = new OAuth2Strategy({
  authorizationURL: cas.authorizationURL,
  tokenURL: cas.tokenUrl,
  clientID: cas.clientId,
  clientSecret: cas.clientSecret,
  callbackURL: config.url('/login/cas/authenticate')
}, applicationCallback)

/**
 * Custom method to get profile information data from CAS Oauth.
 * @param {string} accessToken
 * @param {function} done
 */
oAuthStrategy.userProfile = function (accessToken, done) {
  this._oauth2._request('GET', cas.profileUrl, null, null, accessToken, (err, data) => {
    if (err) {
      return done(err)
    }

    try {
      data = new ProfileSerializer(data)
    } catch (e) {
      return done(e)
    }

    done(null, data)
  })
}

/**
 * Authentication callback that passes received data back to our app.
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {Object<string>} params
 * @param {Object<string>} profile
 * @param {function} done
 */
function applicationCallback (accessToken, refreshToken, params, profile, done) {
  return done(null, { accessToken, expires: params.expires, profile: profile.all })
}

passport.use(oAuthStrategy)
export default passport
