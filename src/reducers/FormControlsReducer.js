import * as actions from '../actions/formActions';

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
          errorMsg: action.errorMsg,
          isValid: false,
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

};

export default actionsMap;
