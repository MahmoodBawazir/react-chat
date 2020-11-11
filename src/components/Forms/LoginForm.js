import React, { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LinearProgress from '@material-ui/core/LinearProgress'
import Alert from '@material-ui/lab/Alert'

import FormHeader from 'components/FormElements/FormHeader'
import { useAuthContext, signIn, clearError } from 'contexts/auth-context'
import Form from 'components/Form'
import Button from 'components/Button'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  errorAlert: {
    marginTop: theme.spacing(3)
  }
}))

const LoginForm = () => {
  const classes = useStyles()
  const { handleSubmit, register, errors, control } = useForm()
  const [{ error, loading }, authDispatch] = useAuthContext()

  const onFormSubmit = (data) => signIn(authDispatch, data)

  useEffect(() => {
    return () => clearError(authDispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      {loading && <LinearProgress />}

      <CardContent>
        <FormHeader content="Login" icon={<LockOpenIcon />} />
        {error && (
          <Alert
            className={classes.errorAlert}
            variant="filled"
            severity="error"
          >
            {error.message}
          </Alert>
        )}
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({
              required: 'This field is required'
            })}
            error={errors.password !== undefined}
            helperText={errors.password && errors.password.message}
          />
          <FormControlLabel
            control={
              <Controller
                as={Checkbox}
                control={control}
                name="remember"
                color="primary"
                defaultValue={false}
              />
            }
            label="Remember me"
          />
          <Button fullWidth disabled={loading}>
            Login
          </Button>
          <Grid container justify="flex-end">
            <Grid item xs>
              <Link
                to="/forgot-password"
                component={RouterLink}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" component={RouterLink} variant="body2">
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm
