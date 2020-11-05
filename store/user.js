export const state = () => ({
  name: 'Neautorizovaný uživatel',
  oidos: null,
  tokenExpires: null,
  tokenIssued: null,
  role: 'user',
  token: null,
  loaded: false,
  authenticated: false
})

export const action = {
  logout ({ commit }) {
    commit('removeUser')
  }
}

export const mutations = {
  storeUser (state, payload) {
    state.name = payload.name
    state.oidos = payload.oidos
    state.role = payload.role
    state.loaded = true
  },
  storeToken (state, token) {
    state.token = token
  },
  removeUser (state) {
    state.name = ''
    state.oidos = null
    state.tokenExpires = null
    state.tokenIssued = null
    state.permissions = {}
    state.roles = []
    state.token = ''
    state.loaded = false
  }
}

export const getters = {
  hasPermissionTo: state => (expectedPermission) => {
    const permissionSchema = {
      read: 1,
      write: 2,
      delete: 4
    }

    const dotPosition = expectedPermission.indexOf(':')
    const section = expectedPermission.substr(0, dotPosition)
    const permissions = expectedPermission.substr(dotPosition + 1)
    const permissionArray = permissions.split(',')

    let requiredPermission = 0
    for (const permission of permissionArray) {
      requiredPermission += permissionSchema[permission]
    }

    if (
      Object.prototype.hasOwnProperty.call(state.role.permissions, section)
    ) {
      const bits = requiredPermission & state.role.permissions[section]
      return bits === requiredPermission
    } else {
      return false
    }
  }
}
