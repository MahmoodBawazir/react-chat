import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}))

const FormHeader = ({ icon, content }) => {
  const classes = useStyles()

  return (
    <div className={classes.paper}>
      {icon && <Avatar className={classes.avatar}>{icon}</Avatar>}
      <Typography component="h1" variant="h5">
        {content}
      </Typography>
    </div>
  )
}

export default FormHeader
