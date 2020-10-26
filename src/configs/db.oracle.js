import logger from '../utils/logger'

export default Object.freeze({
  get connectionString () {
    const conString = process.env.ORACLE_STRING
    if (!conString) {
      const sid = this.database ? `(SID=${this.database})` : ''
      return `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${this.host})(PORT=${this.port}))(CONNECT_DATA=(SERVER=DEDICATED)${sid}))`
    }
    return conString
  },
  get username () {
    const username = process.env.ORACLE_USERNAME
    if (!username) {
      logger.error(new Error('Username must be set.'))
    }
    return username
  },
  get password () {
    const password = process.env.ORACLE_PASSWORD
    if (!password) {
      logger.error(new Error('Password must be set.'))
    }
    return password
  },
  get host () {
    return process.env.ORACLE_HOST || 'localhost'
  },
  get database () {
    return process.env.ORACLE_DATABASE
  },
  get port () {
    return process.env.ORACLE_PORT || 10600
  },
  get pools () {
    const envPools = process.env.ORACLE_POOLS
    let configuredPools = { min: 0, max: 7 }
    if (envPools) {
      const splitPools = envPools.split(',')
      configuredPools = { min: splitPools[0], max: splitPools[1] }
    }
    return configuredPools
  }
})
