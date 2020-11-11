/* eslint-disable */
import React from 'react'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

import MessagesItem from './MessagesItem'
import useChatScroll from 'hooks/useChatScroll'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '420px',
    overflowY: 'scroll',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    padding: '32px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}))

const MessagesList = (props) => {
  const classes = useStyles()

  const { channelLoading, messagesLoading, messages } = props
  const messagesRef = React.useRef()
  const handleScroll = useChatScroll(messagesRef, messages)

  if (messagesLoading || channelLoading) {
    return (
      <Paper elevation={3} className={classes.paper}>
        <CircularProgress size={40} />
        <Typography variant="body1">
          {channelLoading ? 'Waiting for channel...' : 'Fetching messages...'}
        </Typography>
      </Paper>
    )
  }

  if (!messagesLoading && !channelLoading) {
    if (messages.length === 0) {
      return (
        <Typography variant="h6" gutterBottom>
          No messages found in this channel
        </Typography>
      )
    }
  }

  return (
    <List
      className={classes.root}
      ref={(el) => (messagesRef.current = el)}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <MessagesItem
          key={message.id}
          name={message.user.username}
          avatar={message.user.avatar}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
    </List>
  )
}

export default MessagesList
