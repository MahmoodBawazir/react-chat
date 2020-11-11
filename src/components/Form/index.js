import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%' // Fix IE 11 issue.
  }
}))

const Form = (props) => {
  const { method, onSubmit, noValidate, className, children, ...rest } = props
  const classes = useStyles()

  return (
    <form
      {...rest}
      method={method}
      className={className ? className : classes.form}
      noValidate={noValidate}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

Form.defaultProps = {
  method: 'post',
  noValidate: true
}

export default Form
