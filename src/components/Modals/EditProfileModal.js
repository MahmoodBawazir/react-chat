import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'

import { useModalContext, closeModal } from 'contexts/modal-context'
import EditProfile from 'components/Forms/EditProfileForm'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    width: '100%',
    maxWidth: 600
  }
}))

const AccountModal = (props) => {
  const classes = useStyles()
  const [{ open }, modalDispatch] = useModalContext()

  return (
    <Modal
      {...props}
      className={classes.modal}
      open={open}
      onClose={() => closeModal(modalDispatch)}
      aria-labelledby="Account settings modal"
      aria-describedby="Modal for changing account settings"
    >
      <div className={classes.paper}>
        <EditProfile modalDispatch={modalDispatch} closeModal={closeModal} />
      </div>
    </Modal>
  )
}

AccountModal.muiName = Modal.muiName

export default AccountModal
