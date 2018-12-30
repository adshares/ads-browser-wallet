import * as actions from '../actions/actions';

const authState = {
  password: {
    isValid: false,
    value: '',
    errorMsg: null,
  },
  authModalOpen: false,
  authConfirmed: false
};


export default function (state = authState, action) {
  console.log(action.type);
  switch (action.type) {
    case actions.TOGGLE_AUTHORISATION_DIALOG_GLOBAL: {
      return {
        ...state,
        authModalOpen: action.isOpen
      };
    }
    case actions.GLOBAL_PASS_INPUT_CHANGED: {
      return {
        ...state,
        password: {
          ...state.password,
          value: action.inputValue
        }
      };
    }
    case actions.GLOBAL_PASS_INPUT_VALIDATION_FAILED: {
      return {
        ...state,
        password: {
          ...state.password,
          errorMsg: action.errorMsg
        }
      };
    }
    case actions.GLOBAL_PASS_INPUT_VALIDATION_SUCCESS: {
      return {
        ...state,
        password: {
          ...state.password,
          errorMsg: null,
          isValid: true,
        }
      };
    }

    case actions.CLEAN_AUTHORISATION_DIALOG_GLOBAL: {
      return {
        ...authState
      };
    }
    default:
      return state;
  }
}
