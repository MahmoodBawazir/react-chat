import React, { createContext, useContext, useReducer } from 'react'
import firebase from 'firebase/app'

import * as actionTypes from './types'
import refs from 'api/refs'
import withProvider from 'hoc/withProvider'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const initialState = {
  messages: [],
  loading: false,
  addMessageLoading: false,
  error: null
}

const messageReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE_START:
      return {
        ...state,
        addMessageLoading: true
      }
    case actionTypes.ADD_MESSAGE_FINISH:
      return {
        ...state,
        addMessageLoading: false
      }
    case actionTypes.ADD_MESSAGE_FAIL:
      return {
        ...state,
        addMessageLoading: false,
        error: action.error
      }
    case actionTypes.GET_MESSAGES_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.GET_MESSAGES_FINISH:
      return {
        ...state,
        loading: false,
        messages: action.messages
      }
    case actionTypes.GET_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.FETCH_NEW_MESSAGES_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_NEW_MESSAGES_FINISH:
      return {
        ...state,
        loading: false,
        messages: [...state.messages, action.newMessage]
      }
    case actionTypes.FETCH_NEW_MESSAGES_FAIL:
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

const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState)
  return (
    <MessageStateContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageStateContext.Provider>
  )
}

const useMessageStateContext = () => {
  const context = useContext(MessageStateContext)
  if (context === undefined) {
    throw Error('useMessageStateContext must be used within a MessageProvider')
  }
  return context
}

const useMessageDispatchContext = () => {
  const context = useContext(MessageDispatchContext)
  if (context === undefined) {
    throw Error('useMessageStateDispatch must be used within a MessageProvider')
  }
  return context
}

const useMessageContext = () => [
  useMessageStateContext(),
  useMessageDispatchContext()
]

const withMessageProvider = (Component) =>
  withProvider(MessageProvider)(Component)

const clearError = (dispatch) => {
  dispatch({ type: actionTypes.CLEAR_ERROR })
}

const addMessage = async (dispatch, { message, user, currentChannel }) => {
  dispatch({ type: actionTypes.ADD_MESSAGE_START })
  try {
    const messagesRef = refs.getMessagesRef()
    const addedMessage = await messagesRef
      .doc(currentChannel.id)
      .collection('data')
      .add({
        content: message,
        // serverTimestamp with add will get an estimated value, not the actual value
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      })

    // update timestamp with actual server timestamp value
    await messagesRef
      .doc(currentChannel.id)
      .collection('data')
      .doc(addedMessage.id)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })

    dispatch({ type: actionTypes.ADD_MESSAGE_FINISH })
  } catch (error) {
    dispatch({ type: actionTypes.ADD_MESSAGE_FAIL, error })
  }
}

const getMessages = async (dispatch, { channelId }) => {
  dispatch({ type: actionTypes.GET_MESSAGES_START })

  try {
    const messagesRef = refs.getMessagesRef()

    const snapshot = await messagesRef
      .doc(channelId)
      .collection('data')
      .orderBy('timestamp', 'asc')
      .get()
    const messages = snapshot.docs.map((doc) => {
      let message = doc.data()
      message.id = doc.id

      return message
    })
    dispatch({ type: actionTypes.GET_MESSAGES_FINISH, messages })
  } catch (error) {
    dispatch({ type: actionTypes.GET_MESSAGES_FAIL, error })
  }
}

const fetchNewMessages = (dispatch, { channelId }) => {
  dispatch({ type: actionTypes.FETCH_NEW_MESSAGES_START })
  let initialLoad = true
  const messagesRef = refs.getMessagesRef()
  const unsubscribe = messagesRef
    .doc(channelId)
    .collection('data')
    .onSnapshot(
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
                type: actionTypes.FETCH_NEW_MESSAGES_FINISH,
                newMessage: docData
              })
            }
          })
        }
      },
      (error) => {
        dispatch({ type: actionTypes.FETCH_NEW_MESSAGES_FAIL, error })
      }
    )

  return unsubscribe
}

export {
  useMessageContext,
  useMessageStateContext,
  useMessageDispatchContext,
  fetchNewMessages,
  getMessages,
  addMessage,
  clearError,
  withMessageProvider
}
