import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import vault from './vault';
import KeysImporterPage from './KeyImporterReducer';

export default history => combineReducers({
  router: connectRouter(history),
  vault,
  pages: combineReducers({
    KeysImporterPage,
  })
});
