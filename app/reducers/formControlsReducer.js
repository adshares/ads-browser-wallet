import * as actions from '../actions/form';
import { TOGGLE_AUTHORISATION_DIALOG } from '../actions/actions';

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
  [actions.FORM_VALIDATION_FAILED](state, action) {
    return {
      ...state,
      ...action.payload
    };
  },

  [TOGGLE_AUTHORISATION_DIALOG](state, action) {
    return {
      ...state,
      auth: {
        ...state.auth,
        authModalOpen: action.isOpen
      }
    };
  }
};

export { actionsMap };
