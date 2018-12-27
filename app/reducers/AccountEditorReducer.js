import * as actions from '../actions/form';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';

const initialState = {
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
    publicKey: {
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
  [actions.FORM_CLEAN](state, action) {
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
        ...state.auth,
        authModalOpen: action.isOpen
      }
    };
  }
};

export default function (state = initialState, action) {
  if (action.pageName !== AccountEditorPage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
