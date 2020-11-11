import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'

import { useModalContext, closeModal } from 'contexts/modal-context'
import AddChannelForm from 'components/Forms/AddChannelForm'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    maxWidth: 400
  }
}))

const AddChannelModal = (props) => {
  const classes = useStyles()
  const [{ open }, modalDispatch] = useModalContext()

  return (
    <Modal
      {...props}
      className={classes.modal}
      open={open}
      onClose={() => closeModal(modalDispatch)}
      aria-labelledby="Add channel modal"
      aria-describedby="Modal for adding a channel"
    >
      <div className={classes.paper}>
        <AddChannelForm modalDispatch={modalDispatch} closeModal={closeModal} />
      </div>
    </Modal>
  )
}

AddChannelModal.muiName = Modal.muiName

export default AddChannelModal
