import * as actions from '../actions/form';
import PasswordUpdatePage from '../containers/Settings/PasswordUpdatePage';

const initialState = {
  isSubmitted: false,

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
};

export default function (state = initialState, action) {
  if (action.pageName !== PasswordUpdatePage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
