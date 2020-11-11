import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { withChannelProvider } from 'contexts/channel-context'
import Drawer from 'components/Drawer'
import Messages from 'components/Messages'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}))

const Main = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Drawer />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Messages />
      </main>
    </div>
  )
}

export default withChannelProvider(Main)
