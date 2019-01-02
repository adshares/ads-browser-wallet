import * as actions from '../actions/form';
import * as settingsActions from '../actions/settingsActions';
import PasswordChangePage from '../containers/Settings/PasswordChangePage';

const initialState = {
  isSubmitted: false,
  isPasswordChanged: false,
  errorMsg: '',
  inputs: {
    currentPassword: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    newPassword: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    repeatedPassword: {
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

  [settingsActions.SETTINGS_CHANGE_PASSWORD](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },

  [settingsActions.SETTINGS_PASSWORD_CHANGE_SUCCESS](state) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isPasswordChanged: true,
    };
  },

  [settingsActions.SETTINGS_PASSWORD_CHANGE_FAILURE](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: action.errorMsg
    };
  },
};

export default function (state = initialState, action) {
  if (action.pageName !== PasswordChangePage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
