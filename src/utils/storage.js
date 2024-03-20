import config from '../config/config';

function prepareForms(dirty) {
  const forms = {};
  Object.entries(dirty).forEach(([fi, form]) => {
    forms[fi] = {
      ...form,
      isSubmitted: false,
    };
    if (form.inputs) {
      const inputs = {};
      Object.entries(form.inputs).forEach(([ii, input]) => {
        inputs[ii] = {
          ...input,
          value: input.private ? '' : input.value,
        };
      });
      forms[fi] = {
        ...forms[fi],
        inputs,
      };
    }
  });
  return forms;
}

function saveState(state) {
  chrome.storage.local.set({
    [config.routerStorageKey]: JSON.stringify(state.router),
    [config.formsStorageKey]: JSON.stringify(prepareForms(state.pages)),
    [config.transactionsStorageKey]: JSON.stringify(prepareForms(state.transactions)),
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
