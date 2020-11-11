import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuthUser } from 'contexts/auth-context'

const LoggedInWrapper = ({ children }) => {
  const user = useAuthUser()
  const history = useHistory()

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [history, user])

  return <>{children}</>
}

export default LoggedInWrapper
