import { db } from 'api'

export default {
  getUsersRef: () => db.collection('users'),
  getChannelsRef: () => db.collection('channels'),
  getMessagesRef: () => db.collection('messages')
}
