import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import vault from './vault';

export default history => combineReducers({
  router: connectRouter(history),
  vault
});
