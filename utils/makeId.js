export const makeId = length => {
  let result = ''
  if (typeof length !== 'number') return 'Must be a number.'
  if (length > 4) return 'Number must be 4 or less.'
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  return result
}
