import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import vault from './vault';
import queue from './queue';
import KeysImporterPage from './KeyImporterReducer';
import AccountEditorPage from './AccountEditorReducer';
import authDialog from './AuthDialogReducer';
import SendOnePage from './SendOneReducer';

export default history => combineReducers({
  router: connectRouter(history),
  authDialog,
  vault,
  queue,
  pages: combineReducers({
    KeysImporterPage,
    AccountEditorPage,
    SendOnePage,
  })
});
