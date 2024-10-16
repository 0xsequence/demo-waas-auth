export function getStringFromUnknownEvent(e: unknown) {
  if (
    e &&
    typeof e === 'object' &&
    'target' in e &&
    e.target &&
    typeof e.target === 'object' &&
    'value' in e.target &&
    typeof e.target.value === 'string'
  ) {
    return e.target.value
  }
}
