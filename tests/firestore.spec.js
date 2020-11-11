/* eslint-disable no-undef */
const firebase = require('@firebase/rules-unit-testing')
const fs = require('fs')
const http = require('http')

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = 'react-chat-testing'

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
})

before(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync('firestore.rules', 'utf8')
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules })
})

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()))

  // Write the coverage report to a file
  const coverageFile = 'firestore-coverage.html'
  const fstream = fs.createWriteStream(coverageFile)
  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true })

      res.on('end', resolve)
      res.on('error', reject)
    })
  })

  console.log(`View firestore rule coverage information at ${coverageFile}\n`)
})

describe('firestore', () => {
  describe('collection("users")', () => {
    const userFields = {
      id: 'nooh',
      username: 'user',
      email: 'email',
      avatar: 'photo.jpeg',
      emailVerified: false
    }

    it('should let anyone read any profile', async () => {
      const db = getAuthedFirestore(null)
      const profile = db.collection('users').doc('userid')
      await firebase.assertSucceeds(profile.get())
    })

    it('should enforce the `joinedAt` and `modifiedAt` dates as timestamp on add', async () => {
      const db = getAuthedFirestore(null)
      const user = db.collection('users').doc('nooh')

      await firebase.assertFails(
        user.set({
          ...userFields,
          joinedAt: 'not a timestamp',
          modifiedAt: 'not a timestamp'
        })
      )

      await firebase.assertSucceeds(
        user.set({
          ...userFields,
          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    it('should let anyone create a user', async () => {
      const db = getAuthedFirestore(null)
      const user = db.collection('users').doc('nooh')

      await firebase.assertSucceeds(
        user.set({
          ...userFields,
          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    it('should enforce the `modifiedAt` date as timestamp on update', async () => {
      const id = 'nooh'
      const db = getAuthedFirestore({ uid: id })
      const user = db.collection('users').doc('nooh')

      await firebase.assertSucceeds(
        user.set({
          ...userFields,
          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )

      // Fails if `modifiedAt` doesnt exist
      await firebase.assertFails(
        user.update({
          username: 'newusername'
        })
      )

      // Fails if `modifiedAt` is a non timestamp value
      await firebase.assertFails(
        user.update({
          username: 'newusername',
          modifiedAt: 'not a timestamp'
        })
      )

      await firebase.assertSucceeds(
        user.update({
          username: 'newusername',
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    it('should only let users update their own profile', async () => {
      const db = getAuthedFirestore({ uid: 'nooh' })

      await firebase.assertSucceeds(
        db
          .collection('users')
          .doc('nooh')
          .set({
            ...userFields,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
          })
      )

      // Must fail as auth uid is not equal to docId
      await firebase.assertFails(
        db.collection('users').doc('laith').update({
          username: 'newusername',
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )

      // Must pass as auth uid and docId are equal
      await firebase.assertSucceeds(
        db.collection('users').doc('nooh').update({
          username: 'newusername',
          modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })
  })

  describe('collection("channels")', () => {
    it('should require users to log in to read any channel(s)', async () => {
      const db = getAuthedFirestore(null)
      const channels = db.collection('channels')
      await firebase.assertFails(channels.get())
      await firebase.assertFails(channels.doc('channel').get())
    })

    it('should require users to log in before creating a channel', async () => {
      const db = getAuthedFirestore(null)
      const channels = db.collection('channels')

      await firebase.assertFails(
        channels.add({
          name: 'name',
          details: 'details',
          createdBy: {},
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    it('should enforce the `createdAt` date in channels doc', async () => {
      const db = getAuthedFirestore({ uid: 'nooh' })
      const channel = db.collection('channels')

      // Fails if `createdAt` doesn't exist
      await firebase.assertFails(
        channel.add({
          name: 'name',
          details: 'details',
          createdBy: {}
        })
      )
      // Fails if `createdAt` is a non timestamp value
      await firebase.assertFails(
        channel.add({
          name: 'name',
          details: 'details',
          createdBy: {},
          createdAt: 'not a timestamp'
        })
      )

      await firebase.assertSucceeds(
        channel.add({
          name: 'name',
          details: 'details',
          createdBy: {},
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })
  })

  describe('collection("messages/channel")', () => {
    it('should require users to log in to read any message channels', async () => {
      const db = getAuthedFirestore(null)
      const messages = db.collection('messages')
      await firebase.assertFails(messages.get())
    })

    describe('collection("data/message")', () => {
      it('should require users to log in to read any message channel data', async () => {
        const db = getAuthedFirestore(null)
        const messages = db.collection('messages')
        await firebase.assertFails(
          messages.doc('channel').collection('data').get()
        )
      })

      it('should require users to log in before creating a message', async () => {
        const db = getAuthedFirestore(null)
        const messages = db
          .collection('messages')
          .doc('channel')
          .collection('data')

        await firebase.assertFails(
          messages.add({
            id: 'id',
            name: 'name',
            details: 'details',
            createdBy: {},
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        )
      })

      it('should enforce the `timestamp` date in on message add', async () => {
        const db = getAuthedFirestore({ uid: 'nooh' })
        const messages = db
          .collection('messages')
          .doc('channel')
          .collection('data')

        // Fail if timestamp doesnt exist
        await firebase.assertFails(
          messages.add({
            user: 'username',
            content: 'message'
          })
        )

        //fail on non-timestamp value
        await firebase.assertFails(
          messages.add({
            user: 'username',
            content: 'message',
            timestamp: 'not a timestamp'
          })
        )

        await firebase.assertSucceeds(
          messages.add({
            user: 'username',
            content: 'message',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
        )
      })

      it('should enforce the `timestamp` date in on message update', async () => {
        const db = getAuthedFirestore({ uid: 'nooh' })
        const messages = db
          .collection('messages')
          .doc('channel')
          .collection('data')

        const addedMessage = await firebase.assertSucceeds(
          messages.add({
            user: 'username',
            content: 'message',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
        )

        await firebase.assertFails(messages.doc(addedMessage.id).update({}))

        await firebase.assertSucceeds(
          messages.doc(addedMessage.id).update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
        )
      })
    })
  })
})
