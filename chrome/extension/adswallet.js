import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import Root from '../../app/containers/Root';
import VaultCrypt from '../../app/utils/vaultcrypt';
import './adswallet.css';

chrome.storage.local.get(['state'], (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');
  VaultCrypt.load(true, (vault) => {
    initialState.vault = vault;
    console.debug('initialState', initialState);
    const history = createHashHistory();
    if (initialState.router && initialState.router.location) {
      history.push(initialState.router.location);
    }
    const createStore = require('../../app/store/configureStore');

    ReactDOM.render(
      <Root history={history} store={createStore(initialState, history)} />,
      document.querySelector('#root')
    );
  });
});
