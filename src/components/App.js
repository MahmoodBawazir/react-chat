import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

import HomePage from 'views/home'
import RegisterPage from 'views/register'
import LoginPage from 'views/login'
import ForgotPassword from 'views/forgot-password'

import { useAuthStateContext } from 'contexts/auth-context'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

const App = () => {
  const classes = useStyles()
  const { isAuthenticating } = useAuthStateContext()

  if (isAuthenticating) {
    return (
      <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
    </Switch>
  )
}

export default App
