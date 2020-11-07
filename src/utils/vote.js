export function dateIsBeforeToday (voteDate) {
  const today = new Date()
  const date = new Date(voteDate)

  return today > date
}

export function dateIsAfterToday (voteDate) {
  const today = new Date()
  const date = new Date(voteDate)

  return today < date
}