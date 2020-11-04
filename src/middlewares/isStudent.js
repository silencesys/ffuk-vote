import Student from '../models/sis/Student'

export default async function (req, res, next) {
  try {
    // @TODO: should be taken from JWT or cookie
    const student = await new Student({ SIDOS: 97512264 }).fetch()

    if (student) {
      req.user = {
        oidos: student.attributes.SIDOS,
        name: student.fullNameWithTitles
      }

      return next()
    }

    return res.json({
      message: 'Access denied for non students.',
      i18n_message: 'login:access_denied_not_student',
      status: 'error'
    })
  } catch (error) {
    next(error)
  }
}
