import React from 'react'

import Container from '@material-ui/core/Container'

import Head from 'components/Head'
import ForgotPasswordForm from 'components/Forms/ForgotPasswordForm'
import CenteredGrid from 'components/Layouts/CenteredGrid'
import LoggedInWrapper from 'components/LoggedInWrapper'

const ForgotPasswordPage = () => {
  return (
    <LoggedInWrapper>
      <Container maxWidth="xs">
        <CenteredGrid>
          <Head title="Forgot Password" />
          <ForgotPasswordForm />
        </CenteredGrid>
      </Container>
    </LoggedInWrapper>
  )
}

export default ForgotPasswordPage
