export function getMessageFromUnknownError(e: unknown) {
  if (e && typeof e === 'object' && 'message' in e && e.message && typeof e.message === 'string') {
    return e.message
  }
  return 'unknown error'
}
