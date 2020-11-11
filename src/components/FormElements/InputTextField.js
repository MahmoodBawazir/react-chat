import React from 'react'

import TextField from '@material-ui/core/TextField'

const InputTextField = (props) => {
  const {
    getErrorMessage,
    name,
    id,
    label,
    type,
    isValid,
    error,
    ...rest
  } = props
  return (
    <TextField
      {...rest}
      name={name}
      variant="outlined"
      required
      fullWidth
      id={name || id}
      label={label}
      error={!isValid || error}
      helperText={getErrorMessage(name) && error.message}
    />
  )
}

export default InputTextField
