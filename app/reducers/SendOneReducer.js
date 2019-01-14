import ADS from '../utils/ads';
import reduce from './TransactionReducer';

const initialState = {
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

export default (state, action) => reduce(
  ADS.TX_TYPES.SEND_ONE,
  initialState,
  {},
  state,
  action
);
