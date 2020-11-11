import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useAuthUser } from 'contexts/auth-context'
import Button from 'components/Button'
import Form from 'components/Form'

const useStyles = makeStyles((theme) => ({
  errorAlert: {
    marginTop: theme.spacing(3)
  }
}))

const ChangePasswordForm = (props) => {
  const classes = useStyles()
  const { handleSubmit, register, errors, setError, clearErrors } = useForm()
  const error = useRef(false)
  const user = useAuthUser()
  const { modalDispatch, closeModal } = props

  const onFormSubmit = (data) => {
    closeModal(modalDispatch)
  }

  // useEffect(() => {
  //   if (error) {
  //     setError('email', error)
  //   }

  //   return () => {
  //     clearErrors()
  //   }
  // }, [clearErrors, error, setError])

  return (
    <>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Typography variant="h6">Change password</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          id="changePassword"
          label="New password"
          name="changePassword"
          autoComplete="changePassword"
          autoFocus
          inputRef={register({
            required: 'This field is required'
          })}
          error={errors.changePassword !== undefined}
          helperText={errors.changePassword && errors.changePassword.message}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          id="changePasswordConfirmation"
          label="Confirm new password"
          name="changePasswordConfirmation"
          autoComplete="changePasswordConfirmation"
          inputRef={register({
            required: 'This field is required'
          })}
          error={errors.changePasswordConfirmation !== undefined}
          helperText={
            errors.changePasswordConfirmation &&
            errors.changePasswordConfirmation.message
          }
        />

        <Button>Save</Button>
      </Form>
    </>
  )
}

export default ChangePasswordForm
