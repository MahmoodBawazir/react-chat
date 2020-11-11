import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Alert, AlertTitle } from '@material-ui/lab'

import FormHeader from 'components/FormElements/FormHeader'
import {
  useAuthContext,
  resetPassword,
  clearError
} from 'contexts/auth-context'
import Form from 'components/Form'
import Button from 'components/Button'

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    maxWidth: 400
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  alert: {
    marginTop: theme.spacing(3)
  }
}))

const ForgotPasswordForm = () => {
  const classes = useStyles()
  const { handleSubmit, register, errors } = useForm()
  const [{ error, loading }, authDispatch] = useAuthContext()
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState()

  const onFormSubmit = ({ email }) =>
    resetPassword(authDispatch, email).then((_) => {
      setSuccess(true)
      setEmail(email)
    })

  useEffect(() => {
    return () => clearError(authDispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className={classes.card}>
      {loading && <LinearProgress />}

      <CardContent>
        <FormHeader content="Forgot Password" icon={<VpnKeyIcon />} />
        {error && (
          <Alert className={classes.alert} variant="filled" severity="error">
            {error.message}
          </Alert>
        )}

        {success ? (
          <Alert className={classes.alert} variant="filled" severity="success">
            <AlertTitle>Password reset email sent</AlertTitle>
            An email has been sent to your email address, {email}. Follow the
            directions in the email to reset your password.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit(onFormSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={register({
                required: 'This field is required'
              })}
              error={errors.email !== undefined}
              helperText={errors.email && errors.email.message}
            />

            <Button fullWidth loading={loading}>
              reset password
            </Button>
            <Grid container justify="flex-end">
              <Grid item xs>
                <Link to="/login" component={RouterLink} variant="body2">
                  Return to login page
                </Link>
              </Grid>
            </Grid>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

export default ForgotPasswordForm
