import ADS from './ads';

export const address = ({ value }) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  return null;
};

export const amount = ({ value }) => {
  const matches = value.match(/^([0-9]*)[.,]?([0-9]{0,11})[0-9]*$/);
  if (!matches) {
    return 'Please provide an valid amount';
  }
  let max = 38758206;
  if (parseInt(matches[2], 10) > 0) {
    max -= 1;
  }
  if (parseInt(matches[1], 10) > max) {
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
