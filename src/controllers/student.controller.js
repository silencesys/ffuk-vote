import Student from '../models/sis/Student'


/**
 * Search for students by specifying any field in DB.
 *
 * @note might need to add additional filters
 *
 * @param {Object<Request>} req
 * @param {Object<Response>} res
 * @param {Function} next
 *
 * @return {Object<JSON>}
 */
export async function search (req, res) {
  const field = req.body.field.toUpperCase()
  const students = await new Student()
    .where(field, 'in', req.body.values)
    .fetchAll({
      columns: [
        'SIDOS', 'SPRIJMENI', 'SJMENO', 'STITUL', 'STITULZA', 'SOIDENT'
      ]
    })

  return res.json(students)
}