import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import storage from '../utils/storage';

export default function (initialState, history) {
  const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });

  const enhancer = composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(history)),
    // storage(),
  );

  const store = createStore(createRootReducer(history), initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
