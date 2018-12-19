import config from '../config';

function saveState(state) {
  const sealedState = { ...state };
  delete sealedState[config.vaultStorageKey];
  chrome.storage.local.set({ [config.stateStorageKey]: JSON.stringify(sealedState) });
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
