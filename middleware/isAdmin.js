export default function ({ store, redirect }) {
  // If the user's role is not admin
  if (store.state.user.role !== 'admin') {
    return redirect('/')
  }
}
