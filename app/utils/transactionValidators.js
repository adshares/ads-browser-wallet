import ADS from './ads';
import config from '../config/config';

export const address = ({ value }) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  return null;
};

export const amount = ({ value }) => {
  const val = ADS.strToClicks(value);
  if (val === null) {
    return 'Please provide an valid amount';
  }
  if (val.isGreaterThan(config.totalSupply)) {
    return 'Amount is too big';
  }

  return null;
};

export const message = ({ value, transactionType, inputs }) => {
  const textMessage = (inputs.rawMessage && !inputs.rawMessage.value);
  let maxLength = transactionType === ADS.TX_TYPES.BROADCAST ? 64000 : 64;
  if (textMessage) {
    maxLength /= 2;
  }

  // eslint-disable-next-line no-control-regex
  if (textMessage && !/^[\x00-\x7F]*$/.test(value)) {
    return 'Message can contain only ASCII characters';
  } else if (!textMessage && !/^[0-9a-fA-F]*$/.test(value)) {
    return 'Message can contain only hexadecimal characters';
  }
  if (value.length > maxLength) {
    return `Massage is too long (max ${maxLength} characters)`;
  }
  return null;
};

export const publicKey = ({ value }) => {
  if (!value || !ADS.validateKey(value)) {
    return 'Please provide an valid public key';
  }
  return null;
};
