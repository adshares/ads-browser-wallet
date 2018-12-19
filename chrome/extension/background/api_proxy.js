import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';
import queue from '../../../app/utils/queue';

function getInfo() {
  const manifest = chrome.runtime.getManifest();
  return {
    id: chrome.i18n.getMessage('@@extension_id'),
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
  };
}

export default function handleMessage(message, sourceId, callback) {
  switch (message.type) {
    case types.MSG_PING:
      return callback(message.data);
    case types.MSG_INFO:
      return callback(getInfo());
    case types.MSG_SIGN:
      queue.push({
        sourceId,
        time: (new Date()).toISOString(),
        ...message,
      });
      break;
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
