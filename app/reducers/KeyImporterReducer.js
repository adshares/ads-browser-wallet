import * as actions from '../actions/form';
import { OPEN_AUTHORISATION_DIALOG } from '../actions/actions';
import KeysImporterPage from '../containers/Settings/KeysImporterPage';

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
    secretKey: {
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
          value: action.inputValue
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
    console.log('success');
    console.log('success');

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
  [actions.FORM_VALIDATION_SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload
    };
  },
  [actions.FORM_VALIDATION_FAILED](state, action) {
    return {
      ...state,
      ...action.payload
    };
  },

  [actions.FORM_CLEANING](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
  [OPEN_AUTHORISATION_DIALOG](state, action) {
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
  if (action.pageName !== KeysImporterPage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}