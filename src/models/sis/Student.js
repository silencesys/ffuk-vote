import bookshelf from '../../services/bookshelf'
import logger from '../../utils/logger'

const Student = bookshelf.Model.extend({
  tableName: 'STUD',
  hasTimestamps: false,
  idAttribute: 'SIDOS',
  virtuals: {
    fullNameWithTitles () {
      const titleBefore = this.get('STITUL') || ''
      const titleAfter = this.get('STITULZA') || ''

      return `${titleBefore} ${this.get('SJMENO')} ${this.get('SPRIJMENI')} ${titleAfter}`.trim()
    },
    fullName () {
      return `${this.get('SJMENO')} ${this.get('SPRIJMENI')}`
    },
    oidos () {
      return this.get('SIDOS')
    },
    oident () {
      return this.get('SOIDENT')
    }
  }
}, {
  search: async function (id) {
    try {
      const student = await new Student({ SIDOS: id }).fetch({
        columns: ['SIDOS', 'SPRIJMENI', 'SJMENO', 'STITUL', 'STITULZA', 'SOIDENT']
      })
      return student
    } catch (error) {
      if (error instanceof Student.NotFoundError) {
        logger.info(error.stack)
      } else {
        logger.error(error.stack)
      }
      return null
    }
  }
})

export default bookshelf.model('Student', Student)
