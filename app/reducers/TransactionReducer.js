import * as TA from '../actions/transactionActions';

const transactionInitialState = {
  isSubmitted: false,
  accountHash: null,
  transactionData: null,
  extra: null,
  isSignRequired: false,
  signature: null,
  isTransactionSent: false,
  transactionId: null,
  transactionFee: null,
  errorMsg: '',
};

const transactionActionsMap = {
  [TA.INPUT_CHANGED](state, action) {
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

  [TA.VALIDATE_FORM](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },

  [TA.INPUT_VALIDATION_FAILURE](state, action) {
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

  [TA.INPUT_VALIDATION_SUCCESS](state, action) {
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

  [TA.FORM_VALIDATION_SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
    };
  },

  [TA.FORM_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
    };
  },

  [TA.CLEAN_FORM](state, action, initialState) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },

  [TA.SIGN_TRANSACTION](state, action) {
    return {
      ...state,
      isSignRequired: true,
      accountHash: action.accountHash,
      transactionData: action.transactionData,
      extra: action.extra
    };
  },

  [TA.TRANSACTION_ACCEPTED](state, action) {
    return {
      ...state,
      isSignRequired: true,
      signature: action.signature,
      isSubmitted: true,
    };
  },

  [TA.TRANSACTION_REJECTED](state) {
    return {
      ...state,
      isSignRequired: false,
      accountHash: null,
      transactionData: null,
      signature: null,
    };
  },

  [TA.TRANSACTION_SUCCESS](state, action) {
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

  [TA.TRANSACTION_FAILURE](state, action) {
    return {
      ...state,
      isSignRequired: false,
      isSubmitted: false,
      errorMsg: action.errorMsg
    };
  },
};

export default function (transactionType, initialState, actionsMap, state, action) {
  const initial = { ...transactionInitialState, ...initialState };
  const actual = { ...initial, ...state };
  const actions = { ...transactionActionsMap, ...actionsMap };
  if (action.transactionType !== transactionType) return actual;
  if (!actions[action.type]) return actual;
  return actions[action.type](actual, action, initial);
}
