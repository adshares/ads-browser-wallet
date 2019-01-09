/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import AdsRpc from '../utils/adsrpc';
import config from '../config/config';
import createRootReducer from '../reducers';
import storage from '../utils/storage';
import rootEpic from '../epics';
import { adsWalletInit } from '../actions/walletActions';


export default function (initialState, history) {
  const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });

  const adsRpc = new AdsRpc(config.adsRpcHost);
  const epicMiddleware = createEpicMiddleware({
    dependencies: { adsRpc, history }
  });
  const enhancer = composeEnhancers(
    applyMiddleware(epicMiddleware, routerMiddleware(history), logger),
    storage(),
  );

  const store = createStore(createRootReducer(history), initialState, enhancer);
  epicMiddleware.run(rootEpic);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  store.dispatch(adsWalletInit());
  return store;
}
