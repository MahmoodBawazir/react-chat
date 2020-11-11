import React, { useEffect, useRef } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { signOut, useAuthContext } from 'contexts/auth-context'
import {
  openModal,
  useModalDispatchContext,
  modalTypes
} from 'contexts/modal-context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: theme.mixins.toolbar,
  paper: {
    marginRight: theme.spacing(2)
  },
  popper: {
    zIndex: 10
  },
  name: {
    wordBreak: 'break-all'
  }
}))

export default function MenuListComposition() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const [{ currentUser }, authDispatch] = useAuthContext()
  const modalDispatch = useModalDispatchContext()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.toolbar}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={currentUser.avatar} />
          </ListItemAvatar>
          <ListItemText className={classes.name}>
            {currentUser.username}
          </ListItemText>
          <IconButton
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
          <Popper
            className={classes.popper}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem
                        onClick={() => {
                          openModal(modalDispatch, {
                            modalType: modalTypes.EDIT_PROFILE_MODAL
                          })
                        }}
                      >
                        Edit Profile
                      </MenuItem>
                      <MenuItem onClick={() => signOut(authDispatch)}>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </ListItem>
      </List>
    </div>
  )
}
