import config from '../config';

function saveState(state) {
  const sealedState = { ...state };
  delete sealedState[config.vaultStorageKey];
  chrome.storage.local.set({ [config.stateStorageKey]: JSON.stringify(sealedState) });
}

// // todos unmarked count
// function setBadge(todos) {
//   if (chrome.browserAction) {
//     const count = 1;//todos.filter(todo => !todo.marked).length;
//     chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
//   }
// }

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      // setBadge(state.todos);
    });
    return store;
  };
}
