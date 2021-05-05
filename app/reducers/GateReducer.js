import ADS from '../utils/ads';
import reduce from './TransactionReducer';

const initialState = {
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

export default (state, action) => reduce(
  ADS.TX_TYPES.GATE,
  initialState,
  {},
  state,
  action
);
