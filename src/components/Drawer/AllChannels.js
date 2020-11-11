import React, { useEffect } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Skeleton from '@material-ui/lab/Skeleton'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'

import {
  openModal,
  useModalDispatchContext,
  modalTypes
} from 'contexts/modal-context'
import {
  useChannelContext,
  setCurrentChannel,
  setPrivateChannel,
  getChannels,
  fetchChannels
} from 'contexts/channel-context'
import useAccordionState from 'hooks/useAccordionState'

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}))

const AllChannels = () => {
  const classes = useStyles()
  const [expanded, toggleExpanded] = useAccordionState()
  const modalDispatch = useModalDispatchContext()
  const [
    { currentChannel, channels, loading },
    channelDispatch
  ] = useChannelContext()

  const setFirstChannel = (channels) => {
    if (channels.length > 0) {
      const firstChannel = channels[0]
      setCurrentChannel(channelDispatch, firstChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const changeChannel = (channel) => {
    setCurrentChannel(channelDispatch, channel)
    setPrivateChannel(channelDispatch, false)
  }

  useEffect(() => {
    getChannels(channelDispatch)
    const unsubscribe = fetchChannels(channelDispatch)

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFirstChannel(channels)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels])

  return (
    <>
      <List>
        {loading ? (
          <>
            <Skeleton
              animation="wave"
              variant="rect"
              width="100%"
              height={48}
              style={{
                transform: 'scale(1)',
                marginBottom: 6
                // borderRadius: 0
              }}
            />

            {[...Array(4)].map((el, i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="rect"
                width="100%"
                height={32}
                align="right"
                style={{
                  transform: 'scale(1)',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 32
                  // borderRadius: 0
                }}
              >
                #
              </Skeleton>
            ))}
          </>
        ) : (
          <>
            <ListItem button>
              <span
                style={{ display: 'inline-flex', width: '100%' }}
                onClick={toggleExpanded}
              >
                <ListItemIcon>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemIcon>
                <ListItemText primary="Channels" />
              </span>
              <span
                onClick={() => {
                  openModal(modalDispatch, {
                    modalType: modalTypes.ADD_CHANNEL_MODAL
                  })
                }}
              >
                <AddIcon />
              </span>
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {channels && channels.length > 0 ? (
                  channels.map((channel) => (
                    <ListItem
                      key={channel.id}
                      button
                      className={classes.nested}
                      onClick={() => changeChannel(channel)}
                      selected={channel.id === currentChannel?.id}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                    >
                      <ListItemText primary={`# ${channel.name}`} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>No channels found</ListItem>
                )}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </>
  )
}

export default AllChannels
