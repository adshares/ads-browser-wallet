const config = {
  isTestnet: false,
  blockLength: 512,
  dividentLength: 2048,
  passwordMinLength: 1,
  initKeysQuantity: 11,
  accountNameMaxLength: 16,
  accountsLimit: 20,
  importedKeysLimit: 20,
  sessionMaxAge: 60 * 60 * 1000,
  vaultStorageKey: 'vault',
  queueStorageKey: 'queue',
  routerStorageKey: 'router',
  proxyConnectionName: 'ads-wallet-proxy',
  operatorUrl: 'https://operator.adshares.net/',
  apiDocUrl: 'https://github.com/adshares/ads/wiki/ADS-API#',
  getAccountLink: 'https://github.com/adshares/ads/wiki/How-to-get-an-account',
  regulations: 'Lorem ipsum dolor sit amet',
};

if (process.env.NODE_ENV !== 'production') {
  module.exports = {
    ...config,
    ...require('./config.testnet'),
  };
} else {
  module.exports = {
    ...config,
    ...require('./config.mainnet'),
  };
}
