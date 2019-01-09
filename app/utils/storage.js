import config from '../config/config';

function saveState(state) {
  chrome.storage.local.set({
    [config.routerStorageKey]: JSON.stringify(state.router),
  });
  if (state.vault.selectedAccount) {
    chrome.storage.local.set({
      [config.accountStorageKey]: JSON.stringify(state.vault.selectedAccount),
    });
  }
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
    });
    return store;
  };
}
