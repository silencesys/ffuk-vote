export class ProfileSerializer {
  constructor (casProfile) {
    this.casProfile = JSON.parse(casProfile)
  }

  /**
   * Get all attributes from CAS profile in a single object.
   * @return {Object}
   */
  get all () {
    const attributes = this._transformToObject(this.casProfile.attributes)
    return {
      id: this.casProfile.id,
      name: attributes.cn || attributes.givenname + ' ' + attributes.sn,
      email: attributes.mail,
      affiliation: attributes.edupersonscopedaffiliation,
      uid: attributes.uid
    }
  }

  /** @return {string} Full name */
  get name () {
    return this.all.name
  }

  /** @return {string} Valid email */
  get email () {
    return this.all.email
  }

  /** @return {number} ID */
  get id () {
    return this.all.id
  }

  /** @return {number} CAS oidos */
  get oidos () {
    return this.all.uid.find(oidos => !isNaN(oidos))
  }

  /** @return {string} User login */
  get login () {
    return this.all.uid.find(login => isNaN(login))
  }

  /**
   * Transform array of objects to flat object containing all attributes.
   * @param {Array<Object>} profileAttributes
   * @return {Object}
   */
  _transformToObject (profileAttributes) {
    const profile = {}
    for (const attribute of profileAttributes) {
      const keyName = Object.keys(attribute)[0]
      profile[keyName] = attribute[keyName]
    }
    return profile
  }
}
