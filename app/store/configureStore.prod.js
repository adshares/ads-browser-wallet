import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import createRootReducer from '../reducers';
import rootEpic from '../epics';
import AdsRpc from '../utils/adsrpc';
import storage from '../utils/storage';
import config from '../config/config';
import { adsWalletInit } from '../actions/actions';

export default function (initialState, history) {
  const adsRpc = new AdsRpc(config.adsRpcHost);
  const epicMiddleware = createEpicMiddleware({
    dependencies: { adsRpc, history }
  });

  const enhancer = compose(
    applyMiddleware(epicMiddleware, routerMiddleware(history)),
    storage()
  );
  const store = createStore(createRootReducer(history), initialState, enhancer);

  epicMiddleware.run(rootEpic);
  store.dispatch(adsWalletInit());
  return store;
}
