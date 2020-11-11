import React from 'react'
import MuiButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(1, 0, 2)
  }
}))

const Button = (props) => {
  const { disabled, loading, children, type, variant, color, ...rest } = props
  const classes = useStyles()

  return (
    <MuiButton
      {...rest}
      type={type}
      variant={variant}
      color={color}
      className={classes.submit}
      disabled={disabled || loading}
    >
      {loading ? <CircularProgress size={25} /> : children}
    </MuiButton>
  )
}

Button.defaultProps = {
  type: 'submit',
  variant: 'contained',
  color: 'primary'
}

export default Button
