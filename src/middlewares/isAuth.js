import jwt from 'jsonwebtoken'
import config from '../configs/app'

export default function (req, res, next) {
  if (!(req.cookies['access-token'] || req.get('Authorization'))) {
    // Token can be received as cookie or as a part of request headers.
    // If there are no token at all, request was not authenticated.
    return next(_authenticationError('Not authenticated', res, 401))
  }

  const token = req.cookies['access-token'] ||
    req.get('Authorization').split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.secret)
  } catch (err) {
    // Token is malformed or expired
    return next(_authenticationError(err, res, 401))
  }

  if (!decodedToken) {
    // Token was not decoded at all.
    return next(_authenticationError('Not authenticated', res, 401))
  }

  // Add user oidos to response for easier access.
  req.authUser = {
    oidos: parseInt(decodedToken.oidos),
    oident: parseInt(decodedToken.oident),
    name: decodedToken.name,
    authenticated: true
  }

  next()
}

/**
 * Handle authentication errors.
 *
 * @param {string|!Object<!Error>} error
 * @param {!Object<!Response>} res
 * @param {number} code
 * @return {Object<Error>}
 */
function _authenticationError (error, res, code = 401) {
  if (typeof error === 'string') {
    // In case only message is passed, we need to create a new Error object, so
    // we can use this method in next() call.
    error = new Error(error)
  }
  error.statusCode = code
  // Token should be normally expired, but little clean up can't be wrong.
  res.clearCookie('access-token')

  return error
}
