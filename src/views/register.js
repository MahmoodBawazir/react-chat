import React from 'react'

import Container from '@material-ui/core/Container'

import Head from 'components/Head'
import RegisterForm from 'components/Forms/RegisterForm'
import CenteredGrid from 'components/Layouts/CenteredGrid'
import LoggedInWrapper from 'components/LoggedInWrapper'

const RegisterPage = () => {
  return (
    <LoggedInWrapper>
      <Container maxWidth="xs">
        <CenteredGrid>
          <Head title="Register" />
          <RegisterForm />
        </CenteredGrid>
      </Container>
    </LoggedInWrapper>
  )
}

export default RegisterPage
