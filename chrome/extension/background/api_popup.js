import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';
import queue from './queue';
import config from '../../../app/config/config';

const MAINNET = 'MAINNET';
const TESTNET = 'TESTNET';

const sessions = {
  [MAINNET]: {
    secret: null,
    expires: null,
  },
  [TESTNET]: {
    secret: null,
    expires: null,
  }
};

export default function handleMessage(message, callback) {
  let key = MAINNET;
  switch (message.type) {
    case types.MSG_RESPONSE:
      queue.pop(
        message.sourceId,
        message.id
      );
      return callback({ status: 'ok' });
    case types.MSG_PING:
      return callback(message.data);
    case types.MSG_SESSION_START:
      key = message.data.testnet ? TESTNET : MAINNET;
      sessions[key].secret = message.data.secret;
      sessions[key].expires = (new Date()).getTime() + config.sessionMaxAge;
      return callback(sessions[key]);
    case types.MSG_SESSION:
      key = message.data.testnet ? TESTNET : MAINNET;
      if (sessions[key].expires && sessions[key].expires >= (new Date()).getTime()) {
        sessions[key].expires = (new Date()).getTime() + config.sessionMaxAge;
        return callback(sessions[key]);
      }
      return callback();
    case types.MSG_SESSION_REMOVE:
      sessions[MAINNET].secret = null;
      sessions[MAINNET].expires = null;
      sessions[TESTNET].secret = null;
      sessions[TESTNET].expires = null;
      return callback({ status: 'ok' });
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
