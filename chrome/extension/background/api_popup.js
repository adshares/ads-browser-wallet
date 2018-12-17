import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';

export default function handleMessage(message, callback) {
  switch (message.type) {
    case types.MSG_SESSION_START:
      return callback({ type: types.MSG_SESSION });
    case types.MSG_SESSION:
      return callback({ type: types.MSG_SESSION });
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}