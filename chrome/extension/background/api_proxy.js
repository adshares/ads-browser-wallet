import * as types from '../../../app/constants/MessageTypes';
import { PostMessageError } from '../../../app/actions/errors';
import queue from './queue';
import { openInTheNewTab } from '../../../app/utils/utils';

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
    case types.MSG_SIGN:
      queue.pushUnique({
        sourceId,
        testnet: !!message.testnet,
        type: message.type,
        id: message.id,
        data: message.data,
        time: (new Date()).toISOString(),
      });
      if (message.options.newTab) {
        const network = message.testnet ? '/testnet' : '/mainnet';
        const url = `window.html#${network}/transactions/${sourceId}/${message.id}/popup-sign`;
        openInTheNewTab(url);
      }
      break;
    default:
      throw new PostMessageError(`Unknown message type: ${message.type}`, 400);
  }
}
