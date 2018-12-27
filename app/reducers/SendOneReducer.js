import * as actions from '../actions/form';
import SendOnePage from '../containers/Transactions/SendOnePage';

const initialState = {
  isSubmitted: false,
  inputs: {
    address: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    amount: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    message: {
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
};

export default function (state = initialState, action) {
  if (action.pageName !== SendOnePage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
