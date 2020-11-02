import jwt from 'jsonwebtoken'
import passport from '../services/passport'
import config from '../configs/app'
import Student from '../models/sis/Student'

/**
 * Authenticate user and set redirect URL to state parameter, so it can be used
 * later in the authentication loop to redirect user to right URL.
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 */
export async function authenticate (req, res, next) {
  const { redirect } = req.query
  const state = redirect
    ? Buffer.from(JSON.stringify(redirect)).toString('base64')
    : undefined
  const authenticator = passport.authenticate('oauth2', { scope: [], state })

  authenticator(req, res, next)
}

/**
 * Login user after successfull authentication and set cookie with JWT token.
 * The cookie is set, because I was not able to discover cleaner way how to pass
 * JWT from backend to frontend.
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 */
export async function loginUser (req, res, next) {
  // Set redirect URL, if there is any.
  const redirect = _determineRedirect(req)

  const user = await new Student({ SIDOS: req.user.profile.oidos }).fetch()

  if (user === null || user.error) {
    // User was not found in the application database, so the app will redirect back.
    // @NOTE: there might be additional logic related to default user roles.
    return res.redirect('/')
  }
  // User was found in the db and we can create JWT token.
  const jwt = _token(user)

  return res
    .cookie('access-token', jwt, {
      expires: new Date(Date.now() + 7 * 900000) // cookie will be removed in 120 min
    })
    .redirect(redirect)
}

/**
 * Determine where should be user redirected after login.
 *
 * @param {Object.<Request>} query is property of the request object
 */
function _determineRedirect ({ query }) {
  let redirect = '/'
  try {
    const expectedRedirectUrl = JSON.parse(
      Buffer.from(query.state, 'base64').toString()
    )

    if (
      typeof expectedRedirectUrl === 'string' &&
      expectedRedirectUrl.startsWith('/')
    ) {
      redirect = expectedRedirectUrl
    }
  } catch (e) {
    // Do nothing, just surf 🏄🏼‍♂️
  }

  return redirect
}

export async function loginLocalUser (req, res, next) {
  // @TODO: authenticate user via something local - password?
  if (req.body.password === process.env.LOCAL_PASSWORD) {
    const user = {
      oidos: req.body.username,
      profile: {
        id: req.body.username,
        name: 'Martin Roček'
      }
    }

    const jwt = _token(user.profile)

    return res.json({ message: 'success', jwt })
  }
  res.json('Failed')
}

export async function logoutUser (req, res, next) {
  res.clearCookie('access-token')
  res.status(200).json({ success: true })
}

/**
 * Generate the JWT token.
 *
 * @param {Object<string>} user
 * @return {string}
 */
function _token (user) {
  const token = jwt.sign(
    {
      name: user.name,
      oidos: user.oidos,
      oident: user.oident,
      id: user._id
    },
    config.secret,
    { expiresIn: '2h' }
  )
  return token
}
