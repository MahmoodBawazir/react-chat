import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import * as actionTypes from './types'
import AddChannelModal from 'components/Modals/AddChannelModal'
import EditProfileModal from 'components/Modals/EditProfileModal'

const ModalStateContext = createContext()
const ModalDispatchContext = createContext()

const initialState = {
  modalType: null,
  modalProps: null,
  open: false
}

const modalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        modalType: action.modalType,
        modalProps: action.modalProps,
        open: true
      }
    case actionTypes.CLOSE_MODAL:
      return initialState
    default:
      return state
  }
}

const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState)
  return (
    <ModalStateContext.Provider value={state}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  )
}

const useModalStateContext = () => {
  const context = useContext(ModalStateContext)
  if (context === undefined) {
    throw Error('useModalStateContext must be used within a UserProvider')
  }
  return context
}

const useModalDispatchContext = () => {
  const context = useContext(ModalDispatchContext)
  if (context === undefined) {
    throw Error('useModalDispatchContext must be used within a UserProvider')
  }
  return context
}

const useModalContext = () => [
  useModalStateContext(),
  useModalDispatchContext()
]

const MODAL_COMPONENTS = {
  ADD_CHANNEL_MODAL: AddChannelModal,
  EDIT_PROFILE_MODAL: EditProfileModal
}

const modalTypesArr = Object.keys(MODAL_COMPONENTS)
export const modalTypes = modalTypesArr.reduce(
  // eslint-disable-next-line no-sequences
  (acc, curr) => ((acc[curr] = curr), acc),
  {}
)

const ModalRoot = () => {
  const { modalType, modalProps } = useModalStateContext()

  if (!modalType) return null

  const SpecificModal = MODAL_COMPONENTS[modalType]
  return <SpecificModal {...modalProps} />
}

ModalRoot.propTypes = {
  modalType: PropTypes.oneOf(modalTypesArr)
}

const openModal = (dispatch, { modalType, modalProps }) => {
  dispatch({ type: actionTypes.OPEN_MODAL, modalType, modalProps })
}

const closeModal = (dispatch) => {
  dispatch({ type: actionTypes.CLOSE_MODAL })
}

export {
  ModalProvider,
  useModalContext,
  useModalStateContext,
  useModalDispatchContext,
  ModalRoot,
  openModal,
  closeModal
}
