import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import vault from './vault';
import queue from './queue';
import KeysImporterPage from './KeyImporterReducer';
import AccountEditorPage from './AccountEditorReducer';
import SettingsPage from './SettingsReducer';
import authDialog from './AuthDialogReducer';
import SendOneReducer from './SendOneReducer';
import ADS from '../utils/ads';

export default history => combineReducers({
  router: connectRouter(history),
  authDialog,
  vault,
  queue,
  transactions: combineReducers({
    [ADS.TX_TYPES.SEND_ONE]: SendOneReducer
  }),
  pages: combineReducers({
    KeysImporterPage,
    AccountEditorPage,
    SettingsPage,
  })
});
