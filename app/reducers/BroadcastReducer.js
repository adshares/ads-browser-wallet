import ADS from '../utils/ads';
import reduce from './TransactionReducer';

const initialState = {
  inputs: {
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
    },
    testFiled: {
      noValid: true,
      isValid: true,
      value: true,
      errorMsg: ''
    }
  }
};

export default (state, action) => reduce(
  ADS.TX_TYPES.BROADCAST,
  initialState,
  {},
  state,
  action
);
