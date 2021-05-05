export const ADS_WALLET_INIT = 'ADS_WALLET_INIT';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP';
export const RETRIEVE_NODES_DATA_IN_INTERVALS = 'RETRIEVE_NODES_DATA_IN_INTERVALS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_STOP = 'RETRIEVE_NODES_DATA_IN_INTERVALS_STOP';
export const RETRIEVE_GATES_DATA_SUCCESS = 'RETRIEVE_GATES_DATA_SUCCESS';
export const RETRIEVE_GATES_DATA_FAILURE = 'RETRIEVE_GATES_DATA_FAILURE';
export const RETRIEVE_GATE_FEE_SUCCESS = 'RETRIEVE_GATE_FEE_SUCCESS';
export const RETRIEVE_GATE_FEE_FAILURE = 'RETRIEVE_GATE_FEE_FAILURE';

export const adsWalletInit = () => ({
  type: ADS_WALLET_INIT,
});

export const retrieveAccountDataInIntervals = initialAccount => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  initialAccount,
});

export const retrieveAccountDataInIntervalsSuccess = account => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS,
  account,
});

export const retrieveAccountDataInIntervalsFailure = error => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE,
  error,
});

export const retrieveAccountDataInIntervalsStop = () => ({
  type: RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
});

export const retrieveNodesDataInIntervals = () => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS,
});

export const retrieveNodesDataInIntervalsSuccess = nodes => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS,
  nodes,
});

export const retrieveNodesDataInIntervalsFailure = error => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE,
  error,
});

export const retrieveNodesDataInIntervalsStop = () => ({
  type: RETRIEVE_NODES_DATA_IN_INTERVALS_STOP,
});

export const retrieveGatesDataSuccess = gates => ({
  type: RETRIEVE_GATES_DATA_SUCCESS,
  gates,
});

export const retrieveGatesDataFailure = error => ({
  type: RETRIEVE_GATES_DATA_FAILURE,
  error,
});

export const retrieveGateFeeSuccess = fee => ({
  type: RETRIEVE_GATE_FEE_SUCCESS,
  fee,
});

export const retrieveGateFeeFailure = error => ({
  type: RETRIEVE_GATE_FEE_FAILURE,
  error,
});
