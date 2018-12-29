const config = {
  testnet: false,
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
  // adsRpcHost: 'https://rpc.adshares.net/',
  adsRpcHost: 'http://127.0.0.12:5000/',
  operatorUrl: 'https://operator.adshares.net/',
  apiDocUrl: 'https://github.com/adshares/ads/wiki/ADS-API#',
  getAccountLink: 'https://github.com/adshares/ads/wiki/How-to-get-an-account',
  regulations:
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed iaculis nulla. ' +
  'Sed porttitor non erat a aliquet. Pellentesque vulputate lacus at mauris congue ultricies. Lorem ipsum dolor sit ' +
  'amet, consectetur adipiscing elit. Fusce gravida quis turpis ac vulputate. Aenean sit amet egestas arcu.\n' +
  '\n' +
  'Praesent ' +
  'purus purus, elementum sed finibus ac, pretium sit amet turpis. Nulla pharetra eu tortor ut viverra. Proin ut ' +
  'felis eu augue sodales dapibus vitae et dui. Orci varius natoque penatibus et magnis dis parturient montes, ' +
  'nascetur ridiculus mus. In eget nibh et risus hendrerit accumsan eu egestas lacus. Suspendisse rhoncus auctor ' +
  'ipsum vel laoreet. Ut varius neque augue, eu tempus nisl semper ac. Nulla interdum tincidunt dignissim.\n' +
  '\n' +
  'Praesent blandit risus massa, a mollis risus suscipit sit amet. Etiam posuere, velit quis placerat interdum, ' +
  'libero libero laoreet velit, quis ultricies nibh arcu at elit. Cras vitae tortor magna. Donec in rhoncus metus, ' +
  'vitae consequat urna. Maecenas pretium nisi a sapien faucibus congue. Nullam sed convallis tortor. Quisque justo ' +
  'dolor, pulvinar ut turpis ac, sagittis lacinia ligula. Donec in sem condimentum, gravida erat non, varius elit. ' +
  'Cras ut velit a felis volutpat vestibulum nec nec lectus. In hendrerit convallis faucibus.',
};

if (window.ADS_NET === 'testnet') {
  module.exports = {
    ...config,
    ...require('./config.testnet'),
  };
} else {
  module.exports = config;
}