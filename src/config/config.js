import BigNumber from 'bignumber.js';

const config = {
  testnet: false,
  blockLength: 512,
  dividendLength: 2048,
  totalSupply: new BigNumber('3875820600000000000'),
  txsMinFee: 10000,
  txsLocalTransferFee: 0.0005,
  txsRemoteTransferFee: 0.0005,
  txsChangeKeyFee: 10000000,
  txsBroadcastFee: 1000,
  feeThreshold: 0.2,
  derivationPath: "m/44'/311'/",
  passwordMinLength: 8,
  initKeysQuantity: 3,
  itemNameMaxLength: 18,
  accountsLimit: 20,
  importedKeysLimit: 20,
  sessionMaxAge: 60 * 60 * 1000,
  vaultStorageKey: 'vault',
  queueStorageKey: 'queue',
  routerStorageKey: 'router',
  accountStorageKey: 'account',
  formsStorageKey: 'forms',
  transactionsStorageKey: 'transactions',
  proxyConnectionName: 'ads-wallet-proxy',
  adsRpcHost: 'https://rpc.adshares.net/',
  operatorUrl: 'https://operator.adshares.net/',
  operatorApiUrl: 'https://ads-operator.adshares.net/',
  apiDocUrl: 'https://github.com/adshares/ads/wiki/ADS-API#',
  helpUrl: 'https://github.com/adshares/ads-browser-wallet/wiki',
  websiteUrl: 'https://adshares.net/',
  supportUrl: 'https://github.com/adshares/ads-browser-wallet/issues',
  termsUrl: 'https://adshares.net/wallet.html#terms',
  privacyUrl: 'https://adshares.net/wallet.html#privacy',
  attributionsUrl: 'https://adshares.net/wallet.html#attributions',
  freeCoinsUrl: 'https://github.com/adshares/ads/wiki/How-to-join-the-Testnet#get-free-test-coins',
  unwrapUrl: 'https://wallet.adshares.net/',
  about: require('./about'),
  terms: require('./terms'),
  attributions: require('./attributions'),
  retrieve_account_data_period: 5000,
};

export default config;

// if (window.ADS_NET === 'testnet') {
//   module.exports = {
//     ...module.exports,
//     ...require('./config.testnet'),
//   };
// }
// if (process.env.NODE_ENV !== 'production') {
//   module.exports = {
//     ...module.exports,
//     ...require('./config.dev'),
//   };
// }
