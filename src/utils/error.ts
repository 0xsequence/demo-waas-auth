export const isAccountAlreadyLinkedError = (e: unknown) => {
  if (e && typeof e === 'object' && 'name' in e) {
    return e.name === 'AccountAlreadyLinked'
  }
  return false
}
