export default async function ({ store, redirect, $axios }) {
  // If the user is not authenticated
  if (!store.state.user.authenticated) {
    try {
      const user = await $axios.$post('/api/user/profile')
      if (user.authenticated) {
        store.commit('user/storeUser', user)
      } else {
        return redirect('/login')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return redirect('/login')
    }
  }
}
