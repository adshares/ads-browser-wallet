const blockLength = 512;

const dividentLength = 2048;

const passwordMinLength = 1;

const initKeysQuantity = 11;

const accountNameMaxLength = 16;

const accountsLimit = 20;

const importedKeysLimit = 20;

const operatorUrl = 'https://operator.adshares.net/';

const testnetOperatorUrl = 'https://operator.e11.click/';

const regulations =
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
  'Cras ut velit a felis volutpat vestibulum nec nec lectus. In hendrerit convallis faucibus.'
;

const getAccountLink = 'https://github.com/adshares/ads/wiki/How-to-get-an-account';

const proxyConnectionName = 'ads-wallet-proxy';

const stateStorageKey = 'ads-wallet';

const vaultStorageKey = 'vault';

const testnetVaultStorageKey = 'testnet-vault';

const queueStorageKey = 'queue';

const testnetQueueStorageKey = 'testnet-queue';

const sessionMaxAge = 60 * 60 * 1000;


export default {
  blockLength,
  dividentLength,
  passwordMinLength,
  initKeysQuantity,
  accountNameMaxLength,
  accountsLimit,
  importedKeysLimit,
  operatorUrl,
  testnetOperatorUrl,
  regulations,
  getAccountLink,
  proxyConnectionName,
  vaultStorageKey,
  testnetVaultStorageKey,
  stateStorageKey,
  queueStorageKey,
  testnetQueueStorageKey,
  sessionMaxAge,
};
