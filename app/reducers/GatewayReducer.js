import ADS from '../utils/ads';
import reduce from './TransactionReducer';
import * as TA from '../actions/transactionActions';

const initialState = {
  gatewayFee: {
    isSubmitted: false,
    value: null,
    errorMsg: '',
  },
  inputs: {
    amount: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
    address: {
      isValid: null,
      value: '',
      errorMsg: '',
    },
  }
};

const actionsMap = {
  [TA.GET_GATEWAY_FEE](state) {
    return {
      ...state,
      gatewayFee: {
        ...state.gatewayFee,
        isSubmitted: true,
      },
    };
  },
  [TA.GET_GATEWAY_FEE_SUCCESS](state, action) {
    return {
      ...state,
      gatewayFee: {
        ...state.gatewayFee,
        isSubmitted: false,
        value: action.fee,
        errorMsg: '',
      }
    };
  },
  [TA.GET_GATEWAY_FEE_FAILURE](state, action) {
    return {
      ...state,
      gatewayFee: {
        ...state.gatewayFee,
        isSubmitted: false,
        value: null,
        errorMsg: action.errorMsg,
      }
    };
  },
};

export default (state, action) => reduce(
  ADS.TX_TYPES.GATEWAY,
  initialState,
  actionsMap,
  state,
  action
);
