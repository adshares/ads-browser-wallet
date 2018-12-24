import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import Root from '../../app/containers/Root';
import VaultCrypt from '../../app/utils/vaultcrypt';
import BgClient from '../../app/utils/background';
import { reload as reloadQueue } from '../../app/actions/queue';
import config from '../../app/config/config';
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

  console.debug('initialState', initialState);
  const store = createStore(initialState, history);

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes[config.queueStorageKey]) {
      store.dispatch(
        reloadQueue(
          JSON.parse(changes[config.queueStorageKey].newValue || '[]')
        )
      );
    }
  });

  ReactDOM.render(
    <Root history={history} store={store} />,
    document.querySelector('#root')
  );
}

chrome.storage.local.get([config.routerStorageKey, config.queueStorageKey], (obj) => {
  const initialState = {
    router: JSON.parse(obj[config.routerStorageKey] || '{}'),
    queue: JSON.parse(obj[config.queueStorageKey] || '[]'),
  };

  VaultCrypt.load((vault) => {
    initialState.vault = vault;
    // Session recovery
    if (!vault.empty && vault.sealed) {
      BgClient.getSession(config.isTestnet, (secret) => {
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
