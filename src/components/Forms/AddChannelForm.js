import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import AddKey from '@material-ui/icons/Add'
import Alert from '@material-ui/lab/Alert'

import FormHeader from 'components/FormElements/FormHeader'
import { useAuthUser } from 'contexts/auth-context'
import {
  withChannelProvider,
  useChannelContext,
  addChannel,
  clearError
} from 'contexts/channel-context'
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

const AddChannelForm = (props) => {
  const classes = useStyles()
  const { handleSubmit, register, errors } = useForm()
  const [{ error, loading }, channelDispatch] = useChannelContext()
  const user = useAuthUser()
  const { modalDispatch, closeModal } = props

  const onFormSubmit = (data) => {
    addChannel(channelDispatch, { ...data, user }).then(() =>
      closeModal(modalDispatch)
    )
  }

  useEffect(() => {
    return () => clearError(channelDispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardContent>
        <FormHeader content="Add channel" icon={<AddKey />} />
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
            id="channelName"
            label="Channel Name"
            name="channelName"
            autoComplete="channelName"
            autoFocus
            inputRef={register({
              required: 'This field is required'
            })}
            error={errors.channelName !== undefined}
            helperText={errors.channelName && errors.channelName.message}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="channelDetails"
            label="Channel Details"
            type="channelDetails"
            id="channelDetails"
            inputRef={register({
              required: 'This field is required'
            })}
            error={errors.channelDetails !== undefined}
            helperText={errors.channelDetails && errors.channelDetails.message}
          />

          <Button fullWidth disabled={loading} loading={loading}>
            Add channel
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}

export default withChannelProvider(AddChannelForm)
