import { getStringFromUnknownEvent } from './getStringFromUnknownEvent'

export function safeEventStringSetter(cb: (str: string) => void) {
  return (e: unknown) => {
    const strVal = getStringFromUnknownEvent(e)
    if (strVal) {
      cb(strVal)
    }
  }
}
