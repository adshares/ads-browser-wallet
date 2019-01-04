// import { createStore, compose, applyMiddleware } from 'redux';
// import { routerMiddleware } from 'connected-react-router';
// import { createEpicMiddleware } from 'redux-observable';
// import createRootReducer from '../reducers';
// import rootEpic from '../epics';
// import AdsRpc from '../utils/adsrpc';
// import storage from '../utils/storage';
// import config from '../config/config';
// import { adsWalletInit } from '../actions/actions';
//
// export default function (initialState, history) {
//   const adsRpc = new AdsRpc(config.adsRpcHost);
//   const epicMiddleware = createEpicMiddleware({
//     dependencies: { adsRpc, history }
//   });
//
//   const enhancer = compose(
//     applyMiddleware(epicMiddleware, routerMiddleware(history)),
//     storage()
//   );
//
//   const store = createStore(createRootReducer(history), initialState, enhancer);
//   epicMiddleware.run(rootEpic);
//
//   store.dispatch(adsWalletInit());
//
//   return store;
// }
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
import { adsWalletInit } from '../actions/actions';


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
