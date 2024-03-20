import config from '../../config/config';

function updateBadge(count) {
  const label = count > 0 ? count.toString() : '';
  // chrome.browserAction.setBadgeText({ text: label });
}

function getQueue(callback) {
  chrome.storage.local.get(config.queueStorageKey, (obj) => {
    callback(JSON.parse(obj[config.queueStorageKey] || '[]'));
  });
}

function saveQueue(queue, callback) {
  chrome.storage.local.set({
    [config.queueStorageKey]: JSON.stringify(queue)
  }, callback);
  updateBadge(queue.length);
}

function push(transaction, callback) {
  getQueue((queue) => {
    queue.push(transaction);
    saveQueue(queue, callback);
  });
}

function pushUnique(transaction, callback) {
  getQueue((queue) => {
    const newQueue = queue.filter(t =>
      t.sourceId !== transaction.sourceId ||
      t.type !== transaction.type
    );
    newQueue.push(transaction);
    saveQueue(newQueue, callback);
  });
}

function pop(sourceId, id, callback) {
  getQueue((queue) => {
    const transaction = queue.filter(
      t => t.sourceId === sourceId && t.id === id
    );
    saveQueue(
      queue.filter(
        t => t.sourceId !== sourceId || t.id !== id
      ),
      () => { if (callback) { callback(transaction); } }
    );
  });
}

function clearFromSource(sourceId, callback) {
  getQueue((queue) => {
    saveQueue(
      queue.filter(t => t.sourceId !== sourceId),
      callback
    );
  });
}

function clear(callback) {
  chrome.storage.local.remove(config.queueStorageKey, callback);
  updateBadge(0);
}

export default {
  push,
  pushUnique,
  pop,
  getQueue,
  clearFromSource,
  clear,
};
