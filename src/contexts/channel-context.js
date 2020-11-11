import React, { createContext, useContext, useReducer } from 'react'
import firebase from 'firebase/app'

import * as actionTypes from './types'
import refs from 'api/refs'
import withProvider from 'hoc/withProvider'

const ChannelStateContext = createContext()
const ChannelDispatchContext = createContext()

const initialState = {
  channels: [],
  currentChannel: null,
  isPrivateChannel: false,
  error: null,
  loading: false
}

const channelReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.currentChannel
      }
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.isPrivateChannel
      }
    case actionTypes.ADD_CHANNEL_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.ADD_CHANNEL_FINISH:
      return {
        ...state,
        loading: false
      }
    case actionTypes.ADD_CHANNEL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.GET_CHANNELS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.GET_CHANNELS_FINISH:
      return {
        ...state,
        loading: false,
        channels: action.channels
      }
    case actionTypes.GET_CHANNELS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.FETCH_NEW_CHANNELS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_NEW_CHANNELS_FINISH:
      return {
        ...state,
        loading: false,
        channels: [action.newChannel, ...state.channels]
      }
    case actionTypes.FETCH_NEW_CHANNELS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        error: null
      }
    default:
      return state
  }
}

const ChannelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(channelReducer, initialState)

  return (
    <ChannelStateContext.Provider value={state}>
      <ChannelDispatchContext.Provider value={dispatch}>
        {children}
      </ChannelDispatchContext.Provider>
    </ChannelStateContext.Provider>
  )
}

const useChannelStateContext = () => {
  const context = useContext(ChannelStateContext)
  if (context === undefined) {
    throw Error('useChannelStateContext must be used within a ChannelProvider')
  }
  return context
}

const useChannelDispatchContext = () => {
  const context = useContext(ChannelDispatchContext)
  if (context === undefined) {
    throw Error(
      'useChannelDispatchContext must be used within a ChannelProvider'
    )
  }
  return context
}

const useChannelContext = () => [
  useChannelStateContext(),
  useChannelDispatchContext()
]

const useCurrentChannel = () => {
  const { currentChannel } = useContext(ChannelStateContext)

  return currentChannel
}

const withChannelProvider = (Component) =>
  withProvider(ChannelProvider)(Component)

const clearError = (dispatch) => {
  dispatch({ type: actionTypes.CLEAR_ERROR })
}

const addChannel = async (dispatch, { user, channelName, channelDetails }) => {
  dispatch({
    type: actionTypes.ADD_CHANNEL_START
  })

  try {
    const channelsRef = refs.getChannelsRef()

    const addedChannel = await channelsRef.add({
      name: channelName,
      details: channelDetails,
      // serverTimestamp with add will get an estimated value, not the actual value
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    })

    // update timestamp with actual server timestamp value
    await channelsRef.doc(addedChannel.id).update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    dispatch({
      type: actionTypes.ADD_CHANNEL_FINISH
    })
  } catch (error) {
    dispatch({
      type: actionTypes.ADD_CHANNEL_FAIL,
      error
    })
  }
}

const getChannels = async (dispatch) => {
  dispatch({ type: actionTypes.GET_CHANNELS_START })

  try {
    const channelsRef = refs.getChannelsRef()

    const snapshot = await channelsRef.orderBy('createdAt', 'desc').get()
    const channels = snapshot.docs.map((doc) => {
      let channel = doc.data()
      channel.id = doc.id

      return channel
    })
    dispatch({ type: actionTypes.GET_CHANNELS_FINISH, channels })
  } catch (error) {
    dispatch({ type: actionTypes.GET_CHANNELS_FAIL, error })
  }
}

const fetchChannels = (dispatch) => {
  dispatch({ type: actionTypes.FETCH_NEW_CHANNELS_START })

  let initialLoad = true
  const channelsRef = refs.getChannelsRef()
  const unsubscribe = channelsRef.onSnapshot(
    { includeMetadataChanges: true },
    (snapshot) => {
      if (initialLoad) {
        initialLoad = false
      } else {
        const changes = snapshot.docChanges()

        changes.forEach((change) => {
          if (change.type === 'added') {
            let doc = change.doc
            // serverTimestamps gets an estimated value on add
            let docData = doc.data({ serverTimestamps: 'estimate' })
            docData.id = doc.id

            dispatch({
              type: actionTypes.FETCH_NEW_CHANNELS_FINISH,
              newChannel: docData
            })
          }
        })
      }
    },
    (error) => {
      dispatch({ type: actionTypes.FETCH_NEW_CHANNELS_FAIL, error })
    }
  )

  return unsubscribe
}

const setCurrentChannel = (dispatch, currentChannel) => {
  dispatch({ type: actionTypes.SET_CURRENT_CHANNEL, currentChannel })
}

const setPrivateChannel = (dispatch, isPrivateChannel) => {
  dispatch({ type: actionTypes.SET_PRIVATE_CHANNEL, isPrivateChannel })
}

export {
  ChannelProvider,
  useChannelStateContext,
  useChannelDispatchContext,
  useChannelContext,
  useCurrentChannel,
  withChannelProvider,
  clearError,
  addChannel,
  getChannels,
  fetchChannels,
  setCurrentChannel,
  setPrivateChannel
}
