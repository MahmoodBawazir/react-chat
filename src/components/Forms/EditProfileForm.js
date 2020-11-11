import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Alert from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import FormHeader from 'components/FormElements/FormHeader'
import Button from 'components/Button'
import Form from 'components/Form'
import {
  useAuthUser,
  useAuthContext,
  editProfile,
  clearError
} from 'contexts/auth-context'

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  file: {
    display: 'none'
  },
  tabs: {
    marginTop: theme.spacing(3)
  }
}))

const EditProfileForm = (props) => {
  const classes = useStyles()
  const { handleSubmit, register, errors, watch, setValue } = useForm()
  const user = useAuthUser()
  const [avatar, setAvatar] = useState(user.avatar)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarSizeError, setAvatarSizeError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [{ error }, authDispatch] = useAuthContext()
  const watchCurrentPassword = watch('currentPassword')

  useEffect(() => {
    return () => clearError(authDispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    if (!file) return

    setSuccess('')

    if (file && file.size > 1 * 1024 * 1024) {
      setAvatarSizeError('Try uploading a file less than 1MB.')
      setIsLoading(false)
    } else {
      reader.onloadend = () => {
        setAvatarFile(file)
        setAvatar(reader.result)
        setAvatarSizeError('')
        setIsLoading(false)
      }
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const onFormSubmit = (data) => {
    if (avatarSizeError) {
      return
    }

    setIsLoading(true)
    setSuccess('')

    editProfile(authDispatch, { ...data, userId: user.id, avatarFile }).then(
      (editedUser) => {
        setIsLoading(false)

        if (editedUser !== undefined) {
          clearError(authDispatch)
          setSuccess('Changes saved!')
          setValue('currentPassword', '')
          setValue('changePassword', '')
          setValue('changePasswordConfirmation', '')
          setAvatarFile(null)
        }
      }
    )
  }

  return (
    <Card>
      <CardContent>
        <FormHeader content="Edit Profile" icon={<AccountCircleIcon />} />

        <Form onSubmit={handleSubmit(onFormSubmit)}>
          {avatarSizeError && (
            <Alert className={classes.alert} variant="filled" severity="error">
              {avatarSizeError}
            </Alert>
          )}

          {error && (
            <Alert className={classes.alert} variant="filled" severity="error">
              {error.message}
            </Alert>
          )}

          {success && (
            <Alert
              className={classes.alert}
              variant="filled"
              severity="success"
            >
              {success}
            </Alert>
          )}

          <Avatar alt={user.username} src={avatar} className={classes.avatar} />

          <input
            type="file"
            name="avatar"
            id="avatar"
            className={classes.file}
            onChange={handleFileChange}
          />
          <label htmlFor="avatar">
            <Button component="span" color="primary" variant="outlined">
              Upload new avatar
            </Button>
          </label>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="none"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
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
                defaultValue={user.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="none"
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                autoComplete="email"
                inputRef={register({
                  required: 'This field is required'
                })}
                error={errors.email !== undefined}
                helperText={errors.email && errors.email.message}
                defaultValue={user.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="none"
                fullWidth
                type="password"
                id="changePassword"
                label="New password"
                name="changePassword"
                autoComplete="changePassword"
                inputRef={register}
                error={errors.changePassword !== undefined}
                helperText={
                  errors.changePassword && errors.changePassword.message
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="none"
                fullWidth
                type="password"
                id="changePasswordConfirmation"
                label="Confirm new password"
                name="changePasswordConfirmation"
                autoComplete="changePasswordConfirmation"
                inputRef={register({
                  validate: (value) =>
                    value === watch('changePassword') ||
                    "Passwords don't match."
                })}
                error={errors.changePasswordConfirmation !== undefined}
                helperText={
                  errors.changePasswordConfirmation &&
                  errors.changePasswordConfirmation.message
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="none"
                required
                fullWidth
                type="password"
                id="currentPassword"
                label="Current password"
                name="currentPassword"
                autoComplete="currentPassword"
                inputRef={register({
                  required: 'This field is required'
                })}
                error={errors.currentPassword !== undefined}
                helperText={
                  errors.currentPassword
                    ? errors.currentPassword.message
                    : 'We need your current password to confirm your changes'
                }
              />
            </Grid>
          </Grid>

          <Button
            loading={isLoading}
            disabled={isLoading || !!avatarSizeError || !watchCurrentPassword}
          >
            Save
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EditProfileForm
