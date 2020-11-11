import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}))

const MessagesHeader = ({ currentChannel }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5">{currentChannel.name}</Typography>
      <Typography variant="body1">{currentChannel.details}</Typography>
    </Paper>
  )
}

export default MessagesHeader
