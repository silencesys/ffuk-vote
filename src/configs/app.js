export default Object.freeze({
  get title () {
    return process.env.APP_NAME || 'Vote Application'
  },
  get host () {
    return process.env.APP_HOST || 'http://localhost'
  },
  get port () {
    return process.env.APP_PORT || 3030
  },
  get version () {
    // u in version number stands for undefined as there is no proper version
    // in package.json file.
    return process.env.npm_package_version || '1.0.0u'
  },
  get allowedCorsDomains () {
    return process.env.APP_CORS || '*'
  },
  get domain () {
    const url = process.env.APP_DOMAIN || `${this.host}:${this.port}`
    const absolute = /^https?:\/\//i
    if (absolute.test(url)) {
      return url
    } else {
      return `http://${url}`
    }
  },
  get registrations () {
    return process.env.REGISTRATIONS_STATUS || 'disabled'
  }
})
