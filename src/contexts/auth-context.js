import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import md5 from 'md5'
import firebase from 'firebase/app'

import * as actionTypes from './types'
import api from 'api'
import refs from 'api/refs'

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

const initialState = {
  currentUser: null,
  isAuthenticating: true,
  error: null,
  loading: false
}

const AuthReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SIGNUP_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.SIGNUP_FINISH:
      return {
        ...state,
        currentUser: action.createdUser,
        loading: false
      }
    case actionTypes.SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.SIGNIN_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.SIGNIN_FINISH:
      return {
        ...state,
        currentUser: action.signedInUser,
        loading: false
      }
    case actionTypes.SIGNIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.SIGNOUT:
      return { ...state, currentUser: null }
    case actionTypes.EDIT_PROFILE_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.EDIT_PROFILE_FINISH:
      return {
        ...state,
        loading: false,
        currentUser: { ...state.currentUser, ...action.editedUser }
      }
    case actionTypes.EDIT_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.RESET_PASSWORD_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.RESET_PASSWORD_FINISH:
      return {
        ...state,
        loading: false
      }
    case actionTypes.RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticating: false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isAuthenticating: false
      }
    case actionTypes.SET_ERROR:
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

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)

  useEffect(() => {
    api.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const currentUser = await getUserById(user.uid)

        // if (!currentUser.emailVerified && user.emailVerified) {
        //   setEmailVerified(dispatch, user.uid)
        // }

        dispatch({
          type: actionTypes.SET_USER,
          payload: currentUser
        })
      } else {
        dispatch({
          type: actionTypes.CLEAR_USER
        })
      }
    })
  }, [])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

const useAuthStateContext = () => {
  const context = useContext(AuthStateContext)
  if (context === undefined) {
    throw Error('useAuthStateContext must be used within a AuthProvider')
  }
  return context
}

const useAuthDispatchContext = () => {
  const context = useContext(AuthDispatchContext)
  if (context === undefined) {
    throw Error('useAuthDispatchContext must be used within a AuthProvider')
  }
  return context
}

const useAuthContext = () => [useAuthStateContext(), useAuthDispatchContext()]

const returnUserSnapshot = (snapshot) => {
  let user

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      user = doc.data()
      user.id = doc.id
    })
  }

  return user
}

// const setEmailVerified = async (dispatch, userId) => {
//   await refs.getUsersRef().doc(userId).update({
//     emailVerified: true
//   })

//   dispatch({ type: 'email verified', emailVerified: true })
// }

const getUserByUsername = (username) =>
  refs
    .getUsersRef()
    .where('username', '==', username)
    .get()
    .then((snapshot) => returnUserSnapshot(snapshot))

const getUserById = (id) =>
  refs
    .getUsersRef()
    .where('id', '==', id)
    .get()
    .then((snapshot) => returnUserSnapshot(snapshot))

const getUserByEmail = (email) =>
  refs
    .getUsersRef()
    .where('email', '==', email)
    .get()
    .then((snapshot) => returnUserSnapshot(snapshot))

const useAuthUser = () => {
  const { currentUser } = useContext(AuthStateContext)

  return currentUser
}

const useAuth = () => {
  const history = useHistory()
  const user = useAuthUser()

  useEffect(() => {
    if (!user) {
      history.push('/login')
    }
  }, [user, history])

  return user
}

const AuthWrapper = ({ children }) => useAuth() && children

const clearError = (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_ERROR
  })
}

const signUp = async (dispatch, { email, password, username }) => {
  dispatch({ type: actionTypes.SIGNUP_START })

  const isUsernameTaken = await getUserByUsername(username)
  if (isUsernameTaken) {
    dispatch({
      type: actionTypes.SIGNUP_FAIL,
      error: { message: 'Looks like that username is taken. Try another?' }
    })
    return
  }

  try {
    // Creates a user
    const createdUser = await api
      .auth()
      .createUserWithEmailAndPassword(email, password)

    // Update createdUser's displayName property with username
    // and photoURL with a random gravatar image
    await createdUser.user.updateProfile({
      displayName: username,
      photoURL: `https://gravatar.com/avatar/${md5(email)}`
    })

    const user = {
      id: createdUser.user.uid,
      username: createdUser.user.displayName,
      email: createdUser.user.email,
      avatar: createdUser.user.photoURL,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      emailVerified: createdUser.user.emailVerified
    }

    // Saves the user to the Realtime database
    await refs.getUsersRef().doc(createdUser.user.uid).set(user)

    // Send verification email
    await createdUser.user.sendEmailVerification()

    dispatch({ type: actionTypes.SIGNUP_FINISH, createdUser: user })
  } catch (error) {
    dispatch({ type: actionTypes.SIGNUP_FAIL, error })
  }
}

const signIn = async (dispatch, { email, password, remember }) => {
  // Check if user actually exists in firestore db
  const userExistsInDb = await getUserByEmail(email)
  if (!userExistsInDb) {
    dispatch({
      type: actionTypes.SIGNIN_FAIL,
      error: { message: 'No user exists with that email' }
    })
    return
  }

  dispatch({ type: actionTypes.SIGNIN_START })
  try {
    // Sign in the user
    const signedInUser = await api
      .auth()
      .signInWithEmailAndPassword(email, password)
    // Should persist state as local or session depending upon remember checkbox
    /* https://firebase.google.com/docs/auth/web/auth-state-persistence */
    const shouldPersistAuthState = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION
    // Set persistence
    api.auth().setPersistence(shouldPersistAuthState)
    dispatch({
      type: actionTypes.SIGNIN_FINISH,
      signedInUser: signedInUser.user
    })
  } catch (error) {
    dispatch({ type: actionTypes.SIGNIN_FAIL, error })
  }
}

const resetPassword = async (dispatch, email) => {
  dispatch({ type: actionTypes.RESET_PASSWORD_START })

  try {
    const auth = api.auth()

    await auth.sendPasswordResetEmail(email)
    dispatch({ type: actionTypes.RESET_PASSWORD_FINISH })
  } catch (error) {
    dispatch({ type: actionTypes.RESET_PASSWORD_FAIL, error })
  }
}

const signOut = async (dispatch) => {
  await api.auth().signOut()
  dispatch({ type: actionTypes.SIGNOUT })
}

const uploadAvatar = async (avatarFile) => {
  const storageRef = api.storage().ref()
  const currentUser = api.auth().currentUser

  const metadata = {
    contentType: 'image/jpeg'
  }

  try {
    const uploadTask = await storageRef
      .child(`avatars/users/${currentUser.uid}`)
      .put(avatarFile, metadata)

    const downloadUrl = await uploadTask.ref.getDownloadURL()

    return downloadUrl
  } catch (err) {
    console.error(err)
  }
}

const reAuthenticate = (currentPassword) => {
  const currentUser = api.auth().currentUser
  const cred = firebase.auth.EmailAuthProvider.credential(
    currentUser.email,
    currentPassword
  )

  return currentUser.reauthenticateWithCredential(cred)
}

const editProfile = async (
  dispatch,
  {
    username,
    userId,
    email,
    avatarFile,
    currentPassword,
    changePassword,
    changePasswordConfirmation
  }
) => {
  dispatch({ type: actionTypes.EDIT_PROFILE_START })

  // Make sure user is authenticated
  let isAuthenticated = false
  await reAuthenticate(currentPassword)
    .then(() => (isAuthenticated = true))
    .catch((error) => {
      dispatch({
        type: actionTypes.EDIT_PROFILE_FAIL,
        error
      })
    })

  if (!isAuthenticated) return

  // Get current user
  const currentUser = api.auth().currentUser

  // Make sure logged-in user matches the requested userId
  if (currentUser.uid !== userId) {
    dispatch({
      type: actionTypes.EDIT_PROFILE_FAIL,
      error: {
        message: 'You do not have permission to edit this profile.'
      }
    })
    return
  }

  // Make sure username isn't taken
  if (username) {
    const takenUsername = await getUserByUsername(username)
    if (takenUsername && takenUsername.username !== currentUser.displayName) {
      dispatch({
        type: actionTypes.EDIT_PROFILE_FAIL,
        error: { message: 'Looks like that username is taken. Try another?' }
      })
      return
    }
  }

  try {
    let editedUser = {}

    // Check if currentPassword is entered and email isn't the same as current email
    if (email && email !== currentUser.email) {
      await currentUser.updateEmail(email)
      await currentUser.sendEmailVerification()
    }

    // update password if changePassword && changePasswordConfirmation are entered
    if (changePassword && changePasswordConfirmation) {
      await currentUser.updatePassword(changePassword)
    }

    if (avatarFile) {
      const uploadedAvatar = await uploadAvatar(avatarFile)
      editedUser = {
        username,
        email,
        avatar: uploadedAvatar,
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      // Update username and avatar
      await currentUser.updateProfile({
        displayName: username,
        photoURL: uploadedAvatar
      })

      await refs.getUsersRef().doc(currentUser.uid).update(editedUser)
    } else {
      editedUser = {
        username,
        email,
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      await currentUser.updateProfile({
        displayName: username
      })

      await refs.getUsersRef().doc(currentUser.uid).update(editedUser)
    }

    dispatch({ type: actionTypes.EDIT_PROFILE_FINISH, editedUser })
    return editedUser
  } catch (error) {
    dispatch({ type: actionTypes.EDIT_PROFILE_FAIL, error })
  }
}

export {
  AuthProvider,
  useAuthContext,
  useAuthStateContext,
  useAuthDispatchContext,
  getUserByUsername,
  useAuth,
  useAuthUser,
  AuthWrapper,
  signUp,
  signIn,
  signOut,
  resetPassword,
  editProfile,
  clearError
}
