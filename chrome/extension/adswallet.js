import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import Root from '../../app/containers/Root';
import VaultCrypt from '../../app/utils/vaultcrypt';
import BgClient from '../../app/utils/background';
import config from '../../app/config';
import './adswallet.css';

function renderDOM(initialState) {
  const history = createHashHistory();
  if (initialState.router && initialState.router.location) {
    if (history.location.path !== initialState.router.location.path ||
      history.location.search !== initialState.router.location.search ||
      history.location.hash !== initialState.router.location.hash) {
      history.push(initialState.router.location);
    }
  }
  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root history={history} store={createStore(initialState, history)} />,
    document.querySelector('#root')
  );
}

chrome.storage.local.get(config.stateStorageKey, (obj) => {
  const initialState = JSON.parse(obj[config.stateStorageKey] || '{}');

  VaultCrypt.load(false, (vault) => {
    initialState.vault = vault;
    console.debug('initialState', initialState);
    if (!vault.empty && vault.sealed) {
      BgClient.getSession((secret) => {
        if (secret) {
          initialState.vault = {
            ...vault,
            ...VaultCrypt.decrypt(vault, window.atob(secret)),
            sealed: false,
          };
        }
        renderDOM(initialState);
      });
    } else {
      renderDOM(initialState);
    }
  });
});
