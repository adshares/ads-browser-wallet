import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import AuthDialogReducer from './AuthDialogReducer';
import VaultReducer from './VaultReducer';
import QueueReducer from './QueueReducer';
import KeyEditorReducer from './KeyEditorReducer';
import AccountEditorReducer from './AccountEditorReducer';
import PasswordEditorReducer from './PasswordEditorReducer';
import SendOneReducer from './SendOneReducer';
import * as SA from '../actions/settingsActions';
import ADS from '../utils/ads';

export default history => combineReducers({
  router: connectRouter(history),
  authDialog: AuthDialogReducer,
  vault: VaultReducer,
  queue: QueueReducer,
  pages: combineReducers({
    [SA.SAVE_KEY]: KeyEditorReducer,
    [SA.SAVE_ACCOUNT]: AccountEditorReducer,
    [SA.CHANGE_PASSWORD]: PasswordEditorReducer,
  }),
  transactions: combineReducers({
    [ADS.TX_TYPES.SEND_ONE]: SendOneReducer
  }),
});
