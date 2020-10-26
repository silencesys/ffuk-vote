import path from 'path'
import fs from 'fs'

import logger from '../utils/logger'

export default class File {
  constructor (fileName = '') {
    // Folder properties
    this.name = fileName
    this.path = '/'
    this.encoding = 'utf-8'
    this.directory = path.resolve()
    this.data = null
    this.error = null

    // Private helpers
    this._directories = []
    this._selfDestructTimer = {}
  }

  setData (data) {
    this.data = data
    return this
  }

  setEncoding (value) {
    this.encoding = value
    return this
  }

  setPath (...folders) {
    this.path = this.constructor.locate(...folders, this.name)
    this._directories = folders

    return this
  }

  save () {
    if (this.error === null) {
      this.makeDirectories(...this._directories)

      try {
        fs.writeFileSync(
          this.path,
          this.data,
          this.encoding
        )
      } catch (err) {
        logger.error(err.stack)
        this.error = err
      }
    }

    return this
  }

  exist () {
    if (this.error === null) {
      try {
        if (fs.existsSync(this.path)) {
          clearTimeout(this._selfDestructTimer)
          return true
        }
      } catch (err) {
        logger.error(err.stack)
        this.error = err
      }
    }

    this.error = new Error('File does not exist.')

    return false
  }

  read () {
    if (this.error === null) {
      if (this.exist()) {
        return fs.readFileSync(this.path, this.encoding)
      }
    }

    return false
  }

  delete () {
    if (this.error === null) {
      try {
        fs.unlinkSync(this.path)
        return true
      } catch (err) {
        logger.error(err.stack)
        this.error = err
      }
    }

    return false
  }

  makeDirectories (...folders) {
    try {
      fs.mkdirSync(
        this.constructor.locate(...folders),
        { recursive: true }
      )
    } catch (err) {
      logger.error(err.stack)
      this.error = err
    }

    return this
  }

  /**
   * Return server path.
   * @deprecated this method should not be used directly
   * @param  {...any} folders
   */
  static locate (...folders) {
    return path.join(
      path.resolve(),
      ...folders
    )
  }
}
