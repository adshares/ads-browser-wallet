import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import Root from '../../app/containers/Root';
import './adswallet.css';

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');
  const history = createHistory();

  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root history={history} store={createStore(initialState, history)} />,
    document.querySelector('#root')
  );
});
