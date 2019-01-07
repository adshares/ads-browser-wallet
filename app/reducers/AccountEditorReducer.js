import * as actions from '../actions/formActions';
import * as settingsActions from '../actions/settingsActions';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';

const initialState = {
  publicKey: '',
  publicKeyLoading: false,
  publicKeyErrorMsg: '',
  isSubmitted: false,
  auth: {
    password: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    authModalOpen: false,
    authConfirmed: false
  },
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
  [actions.INPUT_CHANGED](state, action) {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputName]: {
          ...state.inputs[action.inputName],
          value: action.inputValue,
          errorMsg: action.errorMsg
        }
      }
    };
  },
  [actions.TOGGLE_VISIBILITY](state, action) {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputName]: {
          ...state.inputs[action.inputName],
          shown: action.shown,
        }
      }
    };
  },
  [actions.INPUT_VALIDATION_FAILED](state, action) {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputName]: {
          ...state.inputs[action.inputName],
          errorMsg: action.errorMsg
        }
      }
    };
  },
  [actions.INPUT_VALIDATION_SUCCESS](state, action) {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputName]: {
          ...state.inputs[action.inputName],
          isValid: true,
          errorMsg: '',
        }
      }
    };
  },
  [actions.PASS_INPUT_CHANGED](state, action) {
    return {
      ...state,
      auth: {
        ...state.auth,
        password: {
          ...state.auth.password,
          value: action.inputValue
        }
      }
    };
  },
  [actions.PASS_INPUT_VALIDATION_FAILED](state, action) {
    return {
      ...state,
      auth: {
        ...state.auth,
        password: {
          ...state.auth.password,
          errorMsg: action.errorMsg
        }
      }
    };
  },
  [actions.PASS_INPUT_VALIDATION_SUCCESS](state, action) {
    return {
      ...state,
      auth: {
        ...state.auth,
        password: {
          ...state.auth.password,
          errorMsg: null,
          isValid: action.inputValue
        }
      }
    };
  },
  [actions.FORM_VALIDATION_SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload
    };
  },
  [actions.FORM_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload
    };
  },
  [actions.CLEAN_FORM](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
  [actions.TOGGLE_AUTHORISATION_DIALOG](state, action) {
    return {
      ...state,
      auth: {
        ...initialState.auth,
        authModalOpen: action.isOpen
      }
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
};

export default function (state = initialState, action) {
  if (action.pageName !== settingsActions.SAVE_ACCOUNT) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
