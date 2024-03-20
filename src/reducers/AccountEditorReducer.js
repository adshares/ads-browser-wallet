import * as actions from '../actions/formActions';
import * as settingsActions from '../actions/settingsActions';
import FormReducers from './FormControlsReducer';

const initialState = {
  publicKey: '',
  publicKeyLoading: false,
  publicKeyErrorMsg: '',
  isSubmitted: false,
  isAccountSaved: false,
  errorMsg: '',
  inputs: {
    name: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    address: {
      isValid: false,
      value: '',
      errorMsg: ''
    }
  }
};

const actionsMap = {
  ...FormReducers,
  [actions.CLEAN_FORM](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
  [actions.FORM_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
    };
  },
  [settingsActions.IMPORT_ACCOUNT_PK](state) {
    return {
      ...state,
      publicKey: '',
      publicKeyLoading: true,
      publicKeyErrorMsg: '',
    };
  },
  [settingsActions.IMPORT_ACCOUNT_PK_SUCCESS](state, action) {
    return {
      ...state,
      publicKey: action.publicKey,
      publicKeyLoading: false,
      publicKeyErrorMsg: '',
    };
  },
  [settingsActions.IMPORT_ACCOUNT_PK_FAILURE](state, action) {
    return {
      ...state,
      publicKey: action.publicKey,
      publicKeyLoading: false,
      publicKeyErrorMsg: action.errorMsg,
    };
  },
  [settingsActions.SAVE_ACCOUNT](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },
  [settingsActions.SAVE_ACCOUNT_SUCCESS](state) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isAccountSaved: true,
    };
  },
  [settingsActions.SAVE_ACCOUNT_FAILURE](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: action.errorMsg,
    };
  },
};

export default function (state = initialState, action) {
  if (action.pageName !== settingsActions.SAVE_ACCOUNT) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
