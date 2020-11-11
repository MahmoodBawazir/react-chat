import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'

import { useAuthUser } from 'contexts/auth-context'
import {
  useMessageContext,
  addMessage,
  clearError
} from 'contexts/message-context'
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

const MessagesForm = (props) => {
  const classes = useStyles()
  const { handleSubmit, register, setValue } = useForm({
    reValidateMode: 'onSubmit'
  })
  const { currentChannel, channelLoading } = props
  const [
    { error, loading: messagesLoading },
    messageDispatch
  ] = useMessageContext()
  const user = useAuthUser()

  const onFormSubmit = (data) => {
    addMessage(messageDispatch, { ...data, currentChannel, user })
    setValue('message', '')
  }

  useEffect(() => {
    return () => clearError(messageDispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {error && (
        <Alert className={classes.errorAlert} variant="filled" severity="error">
          {error.message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="message"
          placeholder="Message"
          name="message"
          autoComplete="off"
          autoFocus
          inputRef={register({
            required: 'Message is empty',
            validate: (value) => value.trim().length !== 0 || 'Message is empty'
          })}
          disabled={messagesLoading || channelLoading}
        />

        <Button loading={messagesLoading || channelLoading}>Send</Button>
      </Form>
    </>
  )
}

export default MessagesForm
