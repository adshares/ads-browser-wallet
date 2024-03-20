import * as types from '../../constants/MessageTypes'
import { PostMessageError } from '../../actions/errors'
import queue from './queue'
import config from '../../config/config'

const MAINNET = 'MAINNET'
const TESTNET = 'TESTNET'

const sessions = {
  testnet: false,
  [MAINNET]: {
    secret: null,
    expires: null,
  },
  [TESTNET]: {
    secret: null,
    expires: null,
  }
}

export default function handleMessage (message, callback) {
  let key = MAINNET
  switch (message.type) {
    case types.MSG_RESPONSE:
      queue.pop(
        message.sourceId,
        message.id
      )
      return callback({ status: 'ok' })
    case types.MSG_PING:
      return callback(message.data)
    case types.MSG_SESSION_START:
      console.log('session start', message.data.secret)
      key = sessions.testnet ? TESTNET : MAINNET
      sessions[key].secret = message.data.secret
      sessions[key].expires = (new Date()).getTime() + config.sessionMaxAge
      return callback({ testnet: sessions.testnet, ...sessions[key] })
    case types.MSG_SESSION:
      key = sessions.testnet ? TESTNET : MAINNET
      if (sessions[key].expires && sessions[key].expires >= (new Date()).getTime()) {
        sessions[key].expires = (new Date()).getTime() + config.sessionMaxAge
        return callback({ testnet: sessions.testnet, ...sessions[key] })
      }
      return callback({ testnet: sessions.testnet })
    case types.MSG_SESSION_NETWORK:
      sessions.testnet = !!message.data.testnet
      return callback({ testnet: sessions.testnet })
    case types.MSG_SESSION_REMOVE:
      sessions[MAINNET].secret = null
      sessions[MAINNET].expires = null
      sessions[TESTNET].secret = null
      sessions[TESTNET].expires = null
      return callback({ status: 'ok' })
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400)
  }
}
