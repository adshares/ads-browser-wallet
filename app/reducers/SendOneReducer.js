import * as actions from '../actions/transactionActions';
import ADS from '../utils/ads';

const initialState = {
  isSubmitted: false,
  accountHash: null,
  transactionData: null,
  isSignRequired: false,
  signature: null,
  isTransactionSent: false,
  transactionId: null,
  transactionFee: null,
  errorMsg: '',
  inputs: {
    address: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
    amount: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
    message: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
    rawMessage: {
      noValid: true,
      isValid: true,
      value: true,
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

  [actions.VALIDATE_FORM](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },

  [actions.INPUT_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputName]: {
          ...state.inputs[action.inputName],
          isValid: false,
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
      ...action.payload,
      isSubmitted: false,
    };
  },

  [actions.FORM_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
    };
  },

  [actions.CLEAN_FORM](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },

  [actions.SIGN_TRANSACTION](state, action) {
    return {
      ...state,
      isSignRequired: true,
      accountHash: action.accountHash,
      transactionData: action.transactionData
    };
  },

  [actions.TRANSACTION_ACCEPTED](state, action) {
    return {
      ...state,
      isSignRequired: true,
      signature: action.signature,
      isSubmitted: true,
    };
  },

  [actions.TRANSACTION_REJECTED](state) {
    return {
      ...state,
      isSignRequired: false,
      accountHash: null,
      transactionData: null,
      signature: null,
    };
  },

  [actions.TRANSACTION_SUCCESS](state, action) {
    return {
      ...state,
      isSignRequired: false,
      isSubmitted: false,
      errorMsg: '',
      isTransactionSent: true,
      transactionId: action.transactionId,
      transactionFee: action.transactionFee
    };
  },

  [actions.TRANSACTION_FAILURE](state, action) {
    return {
      ...state,
      isSignRequired: false,
      isSubmitted: false,
      errorMsg: action.errorMsg
    };
  },

};

export default function (state = initialState, action) {
  if (action.transactionType !== ADS.TX_TYPES.SEND_ONE) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
