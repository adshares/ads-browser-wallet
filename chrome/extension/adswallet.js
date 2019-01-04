/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import BgClient from '../../app/utils/background';
import { reload as reloadQueue } from '../../app/actions/queue';
import './adswallet.css';


function renderDOM(Root, initialState, config) {
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
    const initialState = {
      router: JSON.parse(obj[config.routerStorageKey] || '{}'),
      queue: JSON.parse(obj[config.queueStorageKey] || '[]'),
    };
    console.log('init', obj);
    VaultCrypt.load((vault) => {
      initialState.vault = vault;
      if (!vault.empty && vault.sealed && session.secret) {
        const decrypted = VaultCrypt.decrypt(vault, window.atob(session.secret));
        initialState.vault = {
          ...vault,
          ...decrypted,
          selectedAccount: obj[config.accountStorageKey] || decrypted.selectedAccount,
          sealed: false,
        };
      }
      renderDOM(Root, initialState, config);
    });
  });
});
