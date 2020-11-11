import React from 'react'
import moment from 'moment'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  item: {
    marginBottom: theme.spacing(1)
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,.7)'
  }
}))

const MessagesItem = ({ avatar, name, content, timestamp }) => {
  const classes = useStyles()
  const timeFromNow = (timestamp) => {
    const date = new Date(timestamp.toDate()).toUTCString()
    return moment(date).fromNow()
  }

  return (
    <ListItem
      component={Paper}
      elevation={3}
      alignItems="flex-start"
      className={classes.item}
    >
      <ListItemAvatar>
        <Avatar alt={name} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <span>
            {name}&nbsp;&nbsp;
            <span className={classes.date}>{timeFromNow(timestamp)}</span>
          </span>
        }
        secondary={content}
      />
    </ListItem>
  )
}

export default MessagesItem
