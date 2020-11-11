/**
 * Returns the type of error if exists
 * @function getErrorType
 * @param {object} error
 * @returns {string}
 */
export const getErrorType = (error) => {
  if (isEmptyObject(error)) return

  const possibleTypes = ['username', 'email', 'password']

  let word = 'general'

  possibleTypes.some((val) => {
    const isInclude = error.message.includes(val)
    if (isInclude) word = val
  })

  return word
}

export const isObjectType = (value) => typeof value === 'object'
export const isNullOrUndefined = (value) =>
  value === null || value === undefined

export const isObject = (value) => {
  return (
    !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    isObjectType(value) &&
    !(value instanceof Date)
  )
}

export const isEmptyObject = (value) =>
  isObject(value) && !Object.keys(value).length
