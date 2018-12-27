import * as actions from '../actions/actions';

const authState = {
  password: {
    isValid: false,
    value: '',
    errorMsg: ''
  },
  authModalOpen: false,
  authConfirmed: false
};


export default function (state = authState, action) {
  switch (action.type) {
    case actions.TOGGLE_AUTHORISATION_DIALOG_GLOBAL: {
      return {
        ...state,
        auth: {
          ...state.auth,
          authModalOpen: action.isOpen
        }
      };
    }
    case actions.GLOBAL_PASS_INPUT_CHANGED: {
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
    }
    case actions.GLOBAL_PASS_INPUT_VALIDATION_FAILED: {
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
    }
    case actions.GLOBAL_PASS_INPUT_VALIDATION_SUCCESS: {
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
    }
    default:
      return state;
  }
}
