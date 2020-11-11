import React from 'react'

import Container from '@material-ui/core/Container'

import Head from 'components/Head'
import LoginForm from 'components/Forms/LoginForm'
import CenteredGrid from 'components/Layouts/CenteredGrid'
import LoggedInWrapper from 'components/LoggedInWrapper'

const LoginPage = () => {
  return (
    <LoggedInWrapper>
      <Container maxWidth="xs">
        <CenteredGrid>
          <Head title="Login" />
          <LoginForm />
        </CenteredGrid>
      </Container>
    </LoggedInWrapper>
  )
}

export default LoginPage
