import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';

export default function handleMessage(message, callback) {
  switch (message.type) {
    case types.MSG_PING:
      return callback(message.data);
    case types.MSG_SESSION_START:
      return callback();
    case types.MSG_SESSION:
      return callback({ password: 'XYZ' });
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
