import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';
import config from '../../../app/config';

const session = {
  secret: null,
  expires: null,
};

export default function handleMessage(message, callback) {
  switch (message.type) {
    case types.MSG_PING:
      return callback(message.data);
    case types.MSG_SESSION_START:
      session.secret = message.data.secret;
      session.expires = (new Date()).getTime() + config.sessionMaxAge;
      return callback(session);
    case types.MSG_SESSION:
      if (session.expires && session.expires >= (new Date()).getTime()) {
        // session.expires = (new Date()).getTime() + config.sessionMaxAge;
        return callback(session);
      }
      return callback(null);
    case types.MSG_SESSION_REMOVE:
      session.secret = null;
      session.expires = null;
      return callback({ status: 'ok' });
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
