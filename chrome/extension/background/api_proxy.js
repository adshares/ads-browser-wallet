import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';
import queue from './transactions';

export default function handleMessage(message, sourceId, callback) {
  switch (message.type) {
    case types.MSG_PING:
      return callback({
        type: types.MSG_PONG,
        data: message.data,
      });
    case types.MSG_INFO:
      return callback({ type: types.MSG_INFO_RESPONSE });
    case types.MSG_SIGN:
      queue.push({
        sourceId,
        ...message,
      });
      break;
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}