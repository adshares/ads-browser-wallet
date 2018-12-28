import ADS from './ads';

const address = ({ value }) => {
  if (!value || !ADS.validateAddress(value)) {
    return 'Please provide an valid account address';
  }
  return null;
};

const amount = ({ value }) => {
  if (!/^[0-9,.]*$/.test(value)) {
    return 'Please provide an valid amount';
  }
  return null;
};

const message = ({ value, transactionType, inputs }) => {
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
    return `Massage too long (max ${maxLength} characters)`;
  }
  return null;
};

export { address, amount, message };
