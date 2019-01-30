import ADS from '../utils/ads';
import reduce from './TransactionReducer';

const initialState = {
  inputs: {
    publicKey: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
  }
};

export default (state, action) => reduce(
  ADS.TX_TYPES.CHANGE_ACCOUNT_KEY,
  initialState,
  {},
  state,
  action
);
