import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import AuthDialogReducer from './AuthDialogReducer';
import VaultReducer from './VaultReducer';
import QueueReducer from './QueueReducer';
import KeyEditorReducer from './KeyEditorReducer';
import AccountEditorReducer from './AccountEditorReducer';
import PasswordEditorReducer from './PasswordEditorReducer';
import FreeAccountReducer from './FreeAccountReducer';
import SendOneReducer from './SendOneReducer';
import BroadcastReducer from './BroadcastReducer';
import ChangeAccountKeyReducer from './ChangeAccountKeyReducer';
import SettingsReducer from './SettingsReducer';
import GatewayReducer from './GatewayReducer';
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
    [SA.CREATE_FREE_ACCOUNT]: FreeAccountReducer,
    [SA.SETTINGS]: SettingsReducer,
  }),
  transactions: combineReducers({
    [ADS.TX_TYPES.SEND_ONE]: SendOneReducer,
    [ADS.TX_TYPES.BROADCAST]: BroadcastReducer,
    [ADS.TX_TYPES.CHANGE_ACCOUNT_KEY]: ChangeAccountKeyReducer,
    [ADS.TX_TYPES.GATEWAY]: GatewayReducer,
  }),
});
