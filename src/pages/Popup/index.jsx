import React from 'react'
import ReactDOM from 'react-dom'
import { createHashHistory } from 'history'
import BgClient from '../../utils/background'
import { reload as reloadQueue } from '../../actions/queueActions'
import './adswallet.css'
import config from '../../config/config'
import VaultCrypt from '../../utils/vaultcrypt'
import RootContainer from '../../containers/Root'
import { configureStoreDev, configureStoreProd } from '../../store/configureStore'

function createHistory (initialState) {
  const history = createHashHistory()
  if (history.location.pathname === '/' && initialState.router && initialState.router.location) {
    if (history.location.pathname !== initialState.router.location.pathname ||
      history.location.search !== initialState.router.location.search ||
      history.location.hash !== initialState.router.location.hash) {
      history.push(initialState.router.location)
    }
  }

  return history
}

function renderDOM (Root, initialState, config) {
  const history = createHistory(initialState)
  // const createStore = require('../../store/configureStore');

  console.log('renderDom')

  const store = process.env.NODE_ENV === 'production' ? configureStoreProd(initialState, history) : configureStoreDev(initialState, history)

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes[config.queueStorageKey]) {
      store.dispatch(
        reloadQueue(
          JSON.parse(changes[config.queueStorageKey].newValue || '[]')
        )
      )
    }
  })

  ReactDOM.render(
    <Root history={history} store={store}/>,
    document.querySelector('#root')
  )
}

// Session recovery
BgClient.getSession((session) => {
  window.ADS_NET = session.testnet ? 'testnet' : 'mainnet'
  // const config = require('../../config/config');
  // const VaultCrypt = require('../../utils/vaultcrypt');
  // const Root = require('../../containers/Root');

  chrome.storage.local.get([
    config.routerStorageKey,
    config.queueStorageKey,
    config.accountStorageKey,
    config.formsStorageKey,
    config.transactionsStorageKey,
  ], (obj) => {
    const initialState = {}
    if (obj[config.routerStorageKey]) {
      initialState.router = JSON.parse(obj[config.routerStorageKey])
    }
    if (obj[config.queueStorageKey]) {
      initialState.queue = JSON.parse(obj[config.queueStorageKey])
    }
    if (obj[config.formsStorageKey]) {
      initialState.pages = JSON.parse(obj[config.formsStorageKey])
    }
    if (obj[config.transactionsStorageKey]) {
      initialState.transactions = JSON.parse(obj[config.transactionsStorageKey])
    }
    VaultCrypt.load((vault) => {
      initialState.vault = vault
      if (!vault.empty && vault.sealed && session.secret) {
        const decrypted = VaultCrypt.decrypt(vault, window.atob(session.secret))
        let { selectedAccount } = decrypted
        if (obj[config.accountStorageKey]) {
          selectedAccount = JSON.parse(obj[config.accountStorageKey])
        }
        initialState.vault = {
          gates: [],
          ...vault,
          ...decrypted,
          selectedAccount,
          sealed: false,
        }
      }
      renderDOM(RootContainer, initialState, config)
    })
  })
})
