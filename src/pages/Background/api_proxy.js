import * as types from '../../constants/MessageTypes';
import { PostMessageError } from '../../actions/errors';
import queue from './queue';
import { openInTheNewTab } from '../../utils/utils';

function getInfo() {
  const manifest = chrome.runtime.getManifest();
  return {
    id: chrome.runtime.id,
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
    case types.MSG_PUSH:
      queue.push({
        sourceId,
        testnet: message.testnet,
        type: message.type,
        id: message.id,
        data: message.data,
        time: (new Date()).toISOString(),
      });
      break;
    case types.MSG_AUTHENTICATE:
    case types.MSG_SIGN:
      queue.pushUnique({
        sourceId,
        testnet: !!message.testnet,
        type: message.type,
        id: message.id,
        data: message.data,
        time: (new Date()).toISOString(),
      });
      {
        const network = message.testnet ? '/testnet' : '/mainnet';
        const url = `window.html#${network}/transactions/${sourceId}/${message.id}/popup-sign`;
        openInTheNewTab(url);
      }
      break;
    case types.MSG_BROADCAST:
    case types.MSG_SEND_ONE:
      queue.pushUnique({
        sourceId,
        testnet: !!message.testnet,
        type: message.type,
        id: message.id,
        data: message.data,
        time: (new Date()).toISOString(),
      });
      {
        const network = message.testnet ? '/testnet' : '/mainnet';
        const url = `window.html#${network}/transactions/${message.type}/${sourceId}/${message.id}`;
        openInTheNewTab(url);
      }
      break;
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
