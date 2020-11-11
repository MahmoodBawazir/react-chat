import React, { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Alert from '@material-ui/lab/Alert'
import LockIcon from '@material-ui/icons/Lock'
import { makeStyles } from '@material-ui/core/styles'

import FormHeader from 'components/FormElements/FormHeader'
import { emailPattern } from './patterns'
import { useAuthContext, signUp, clearError } from 'contexts/auth-context'
import Form from 'components/Form'
import Button from 'components/Button'

const useStyles = makeStyles((theme) => ({
  errorAlert: {
    marginTop: theme.spacing(3)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2)
  }
}))

const RegisterForm = () => {
  const classes = useStyles()

  const { handleSubmit, register, errors, watch } = useForm()
  const [{ error, loading }, authDispatch] = useAuthContext()

  const onFormSubmit = (data) => signUp(authDispatch, data)

  useEffect(() => {
    return () => clearError(authDispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      {loading && <LinearProgress />}

      <CardContent>
        <FormHeader content="Register" icon={<LockIcon />} />
        {error && (
          <Alert
            className={classes.errorAlert}
            variant="filled"
            severity="error"
          >
            {error.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onFormSubmit)} className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                inputRef={register({
                  required: 'This field is required',
                  validate: {
                    noSpecialChars: (value) =>
                      !/[^a-zA-Z0-9]/.test(value) ||
                      'No spaces or special characters',
                    moreThan: (value) =>
                      value.length >= 5 ||
                      'Username must be at least 5 characters',
                    lessThan: (value) =>
                      value.length <= 12 ||
                      'Username cannot exceed 12 characters'
                  }
                })}
                error={errors.username !== undefined}
                helperText={errors.username && errors.username.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                inputRef={register({
                  required: 'This field is required',
                  pattern: {
                    value: emailPattern,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email !== undefined}
                helperText={errors.email && errors.email.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                inputRef={register({
                  required: 'This field is required',
                  minLength: 6
                })}
                error={errors.password !== undefined}
                helperText={
                  errors.password?.type === 'minLength'
                    ? 'Password should be at least 6 characters'
                    : errors.password?.message
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordConfirmation"
                label="Confirm Password"
                type="password"
                id="passwordConfirmation"
                inputRef={register({
                  required: 'This field is required',
                  validate: (value) =>
                    value === watch('password') || "Passwords don't match."
                })}
                error={errors.passwordConfirmation !== undefined}
                helperText={
                  errors.passwordConfirmation &&
                  errors.passwordConfirmation.message
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth disabled={loading}>
                Register
              </Button>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" component={RouterLink} variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
