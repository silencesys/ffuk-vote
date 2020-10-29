import logger from '../utils/logger'

export default Object.freeze({
  get connectionString () {
    let connString = process.env.MONGO_CONNECTION_STRING || null

    if (
      connString === null && this.name !== null && this.host !== null
    ) {
      // In case connection string was not specified,
      // build connection string from params.
      connString = `${this.formatedUserLogin + this.host}:${this.port}/${this.name + this.query}`
    } else {
      logger.error(new Error('Missing connection string or database name and host.').stack)
    }

    return `mongodb://${connString}`
  },
  get formatedUserLogin () {
    if (this.username !== null) {
      const password = this.password !== null
        ? `:${this.password}` : ''

      return `${this.username + password}@`
    }
    return ''
  },
  get username () {
    return process.env.MONGO_INITDB_ROOT_USERNAME || null
  },
  get password () {
    return process.env.MONGO_INITDB_ROOT_PASSWORD || null
  },
  get name () {
    return process.env.MONGO_INITDB_DATABASE || null
  },
  get host () {
    return process.env.MONGO_HOST || null
  },
  get port () {
    return process.env.MONGO_PORT || 27017
  },
  get query () {
    const query = process.env.MONGO_QUERY
    if (query) {
      return `?${query}`
    }
    return ''
  }
})
