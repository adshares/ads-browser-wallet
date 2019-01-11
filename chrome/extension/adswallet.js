import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import BgClient from '../../app/utils/background';
import { reload as reloadQueue } from '../../app/actions/queueActions';
import './adswallet.css';


function renderDOM(Root, initialState, config) {
  const history = createHashHistory();
  if (initialState.router && initialState.router.location) {
    if (history.location.pathname !== initialState.router.location.pathname ||
      history.location.search !== initialState.router.location.search ||
      history.location.hash !== initialState.router.location.hash) {
      history.push(initialState.router.location);
    }
  }
  const createStore = require('../../app/store/configureStore');

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

// Session recovery
BgClient.getSession((session) => {
  window.ADS_NET = session.testnet ? 'testnet' : 'mainnet';
  const config = require('../../app/config/config');
  const VaultCrypt = require('../../app/utils/vaultcrypt');
  const Root = require('../../app/containers/Root');

  chrome.storage.local.get([
    config.routerStorageKey,
    config.queueStorageKey,
    config.accountStorageKey
  ], (obj) => {
    const initialState = {};
    if (obj[config.routerStorageKey]) {
      initialState.router = JSON.parse(obj[config.routerStorageKey]);
    }
    if (obj[config.queueStorageKey]) {
      initialState.queue = JSON.parse(obj[config.queueStorageKey]);
    }
    VaultCrypt.load((vault) => {
      initialState.vault = vault;
      if (!vault.empty && vault.sealed && session.secret) {
        const decrypted = VaultCrypt.decrypt(vault, window.atob(session.secret));
        let { selectedAccount } = decrypted;
        if (obj[config.accountStorageKey]) {
          selectedAccount = JSON.parse(obj[config.accountStorageKey]);
        }
        initialState.vault = {
          ...vault,
          ...decrypted,
          selectedAccount,
          sealed: false,
        };
      }
      renderDOM(Root, initialState, config);
    });
  });
});
