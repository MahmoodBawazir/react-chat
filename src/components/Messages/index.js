import React, { useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

import MessagesHeader from './MessagesHeader'
import MessagesList from './MessagesList'
import MessagesForm from 'components/Forms/MessagesForm'
import {
  useMessageContext,
  withMessageProvider,
  fetchNewMessages,
  getMessages
} from 'contexts/message-context'
import { useChannelStateContext } from 'contexts/channel-context'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3)
  },
  centeredPaper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8)
  }
}))

const Messages = () => {
  const classes = useStyles()
  const {
    currentChannel,
    channels,
    loading: channelLoading
  } = useChannelStateContext()
  const [
    { messages, loading: messagesLoading },
    messageDispatch
  ] = useMessageContext()

  useEffect(() => {
    let unsubscribe
    if (currentChannel) {
      getMessages(messageDispatch, {
        channelId: currentChannel.id
      })
      unsubscribe = fetchNewMessages(messageDispatch, {
        channelId: currentChannel.id
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel])

  return (
    <>
      {!channelLoading && channels.length === 0 && (
        <Alert className={classes.errorAlert} variant="filled" severity="info">
          No channel found. Add a channel.
        </Alert>
      )}

      {currentChannel === null && channelLoading && (
        <Paper className={classes.centeredPaper}>
          <CircularProgress size={40} />
        </Paper>
      )}

      {currentChannel !== null && (
        <>
          <MessagesHeader currentChannel={currentChannel} />
          <Paper className={classes.paper}>
            <MessagesList
              currentChannel={currentChannel}
              channelLoading={channelLoading}
              messages={messages}
              messagesLoading={messagesLoading}
            />

            <MessagesForm
              currentChannel={currentChannel}
              channelLoading={channelLoading}
            />
          </Paper>
        </>
      )}
    </>
  )
}

export default withMessageProvider(Messages)
