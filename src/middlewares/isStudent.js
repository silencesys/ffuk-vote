import Student from '../models/sis/Student'

export default async function (req, res, next) {
  try {
    const student = await new Student({ SIDOS: req.body.user.oidos }).fetch()

    if (student) {
      req.user = {
        oidos: student.attributes.SIDOS
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
