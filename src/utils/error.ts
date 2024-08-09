export const isAccountAlreadyLinkedError = (e: any) => {
  return e.name === 'AccountAlreadyLinked'
}

export const isIncorrectAnswerError = (e: any) => {
  return e.name === 'AnswerIncorrect'
}
