import React from 'react'

import Head from 'components/Head'
import { AuthWrapper } from 'contexts/auth-context'
import Main from 'components/Main'

function HomePage(props) {
  return (
    <AuthWrapper>
      <Head title="Home" />
      <Main />
    </AuthWrapper>
  )
}

export default HomePage
