import { useState, useEffect, useRef } from 'react'

const useStateWithCallback = (initialValue) => {
  const callbackRef = useRef(null)

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value)

      callbackRef.current = null
    }
  }, [value])

  const setValueWithCallback = (newValue, callback) => {
    callbackRef.current = callback

    return setValue(newValue)
  }

  return [value, setValueWithCallback]
}

export default useStateWithCallback
