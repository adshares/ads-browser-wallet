import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import vault from './vault';
import queue from './queue';
import KeysImporterPage from './KeyImporterReducer';
import AccountEditorPage from './AccountEditorReducer';

export default history => combineReducers({
  router: connectRouter(history),
  vault,
  queue,
  pages: combineReducers({
    KeysImporterPage,
    AccountEditorPage,
  })
});
