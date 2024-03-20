export const ADS_WALLET_INIT = 'ADS_WALLET_INIT';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP = 'RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP';
export const RETRIEVE_NODES_DATA_IN_INTERVALS = 'RETRIEVE_NODES_DATA_IN_INTERVALS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS = 'RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE = 'RETRIEVE_NODES_DATA_IN_INTERVALS_FAILURE';
export const RETRIEVE_NODES_DATA_IN_INTERVALS_STOP = 'RETRIEVE_NODES_DATA_IN_INTERVALS_STOP';
export const RETRIEVE_GATEWAYS_DATA_SUCCESS = 'RETRIEVE_GATEWAYS_DATA_SUCCESS';
export const RETRIEVE_GATEWAYS_DATA_FAILURE = 'RETRIEVE_GATEWAYS_DATA_FAILURE';

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

export const retrieveGatewaysDataSuccess = gateways => ({
  type: RETRIEVE_GATEWAYS_DATA_SUCCESS,
  gateways,
});

export const retrieveGatewaysDataFailure = error => ({
  type: RETRIEVE_GATEWAYS_DATA_FAILURE,
  error,
});

